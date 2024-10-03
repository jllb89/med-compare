import React, { useState, useMemo } from 'react';
import FileUpload from './components/FileUpload';

const App = () => {
  const [matchedData, setMatchedData] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  // Function to handle file uploads and update the table with the results
  const handleFileUpload = (data) => {
    setMatchedData(data);
    if (data.length > 0) setSearchInput(data[0].sku);
  };

  // Function to reset everything and start over
  const handleReset = () => {
    setMatchedData([]);   // Clear matched data
    setSearchInput('');   // Clear SKU input
  };

  // Create a unique set of keys from all matched results for dynamic columns
  const allColumns = useMemo(() => {
    let columns = new Set(['filename']);  // Start with static columns (filename only)
    matchedData.forEach((item) => {
      item.details.forEach((detail) => Object.keys(detail).forEach((key) => columns.add(key)));
    });
    return Array.from(columns);  // Convert the Set to an array
  }, [matchedData]);

  return (
    <div>
      <h1>Med-Compare Platform</h1>
      <FileUpload onFileUpload={handleFileUpload} />

      {/* Render the dynamic results table if matched data is present */}
      {matchedData.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          {/* Updated heading to include the input SKU */}
          <h2>Matching Results for: <span style={{ color: 'blue' }}>{searchInput}</span></h2>
          
          {/* Reset Button */}
          <button
            style={{
              backgroundColor: '#d9534f',
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
          
          {/* Results Table */}
          <table border="1" style={{ margin: '20px 0', borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                {allColumns.map((column) => (
                  <th key={column} style={{ padding: '8px', backgroundColor: '#f2f2f2', cursor: 'pointer' }}>
                    {column.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matchedData.map((entry, index) => (
                entry.details.map((detail, detailIndex) => (
                  <tr key={`${index}-${detailIndex}`}>
                    {allColumns.map((column) => (
                      <td key={column} style={{ padding: '8px', textAlign: 'center' }}>
                        {column === 'filename' ? entry.filename : detail[column] || '-'}
                      </td>
                    ))}
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
