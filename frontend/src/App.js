import React, { useState, useMemo } from 'react';
import FileUpload from './components/FileUpload';
import * as XLSX from 'xlsx'; // Import XLSX for file export

const App = () => {
  const [matchedData, setMatchedData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState({}); // Track selected rows

  // Function to handle file uploads and update the table with the results
  const handleFileUpload = (data) => {
    setMatchedData(data);
    if (data.length > 0) setSearchInput(data[0].sku);
  };

  // Function to reset everything and start over
  const handleReset = () => {
    setMatchedData([]); // Clear matched data
    setSearchInput(''); // Clear SKU input
    setSelectedRows({}); // Clear selected rows
  };

  // Create a unique set of keys from all matched results for dynamic columns
  const allColumns = useMemo(() => {
    let columns = new Set(['filename']); // Start with static columns (filename only)
    matchedData.forEach((item) => {
      item.details.forEach((detail) => Object.keys(detail).forEach((key) => columns.add(key)));
    });
    return Array.from(columns); // Convert the Set to an array
  }, [matchedData]);

  // Flatten the matchedData to have a single list of rows across all files
  const flattenedData = useMemo(() => {
    return matchedData.flatMap((entry) =>
      entry.details.map((detail) => ({
        ...detail,
        filename: entry.filename, // Add the filename to each detail object
      }))
    );
  }, [matchedData]);

  // Sort the flattened data based on the current sort configuration
  const sortedData = useMemo(() => {
    if (sortConfig.key) {
      return [...flattenedData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return flattenedData;
  }, [flattenedData, sortConfig]);

  // Function to handle sorting by column
  const handleSort = (column) => {
    let direction = 'asc';
    if (sortConfig.key === column && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: column, direction });
  };

  // Handle checkbox selection for each row
  const handleCheckboxChange = (rowIndex) => {
    setSelectedRows((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex], // Toggle the checkbox state
    }));
  };

  // Export the selected rows to an xlsx file
  const handleExport = () => {
    const selectedData = sortedData.filter((_, index) => selectedRows[index]); // Get only the selected rows
    const ws = XLSX.utils.json_to_sheet(selectedData); // Convert selected rows to a worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Selected Data');
    XLSX.writeFile(wb, 'SelectedData.xlsx'); // Save as file
  };

  return (
    <div>
      <h1>Med-Compare</h1>
      <FileUpload onFileUpload={handleFileUpload} />

      {/* Render the dynamic results table if matched data is present */}
      {sortedData.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          {/* Updated heading to include the input SKU */}
          <h2>
            Matching Results for: <span style={{ color: 'blue' }}>{searchInput}</span>
          </h2>

          {/* Reset Button */}
          <button
            style={{
              backgroundColor: '#000000',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              cursor: 'pointer',
              marginBottom: '20px',
            }}
            onClick={handleReset}
          >
            Reset
          </button>

          {/* Export Button */}
          <button
            style={{
              backgroundColor: '#007BFF',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              cursor: 'pointer',
              marginBottom: '20px',
              marginLeft: '10px',
            }}
            onClick={handleExport}
            disabled={!Object.values(selectedRows).some((isSelected) => isSelected)} // Disable button if no rows are selected
          >
            Export Selected Rows
          </button>

          {/* Results Table */}
          <table border="1" style={{ margin: '20px 0', borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>Select</th> {/* Add a select column */}
                {allColumns.map((column) => (
                  <th
                    key={column}
                    onClick={() => handleSort(column)} // Add onClick to handle sorting
                    style={{
                      padding: '8px',
                      backgroundColor: '#f2f2f2',
                      cursor: 'pointer',
                      textDecoration: sortConfig.key === column ? 'underline' : 'none',
                    }}
                  >
                    {column.toUpperCase()} {sortConfig.key === column && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((detail, index) => (
                <tr key={index}>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={!!selectedRows[index]} // Check if the row is selected
                      onChange={() => handleCheckboxChange(index)} // Toggle checkbox
                    />
                  </td>
                  {allColumns.map((column) => (
                    <td key={column} style={{ padding: '8px', textAlign: 'center' }}>
                      {detail[column] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
