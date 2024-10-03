import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onFileUpload }) => {
  const [files, setFiles] = useState([]); // Array of files
  const [uploading, setUploading] = useState(false);
  const [sku, setSku] = useState('');
  const [error, setError] = useState('');

  // Handle file selection and add multiple files to the state
  const handleFileChange = (e) => {
    // Merge newly selected files with existing ones in state
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);  // Append new files without overwriting
    setError('');
  };

  // Handle SKU input
  const handleSKUChange = (e) => {
    setSku(e.target.value);
    console.log("SKU entered:", e.target.value);  // Debug: Log SKU input
  };

  // Handle file upload to the server
  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select one or more files to upload.');
      return;
    }

    if (!sku) {
      setError('Please enter an SKU to search for.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();

      // Append each file in the `files` array to FormData
      files.forEach((file, index) => {
        console.log(`Appending file ${index + 1} to formData:`, file);  // Debug: Log each file being appended
        formData.append('files', file);  // All files under the same key 'files'
      });

      formData.append('sku', sku);  // Append the SKU input value to FormData
      console.log("FormData content before sending:", formData);  // Debug: Check FormData before sending

      const response = await axios.post('https://med-compare.onrender.com', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("Response from server:", response.data);  // Debug: Log server response
      onFileUpload(response.data);  // Pass the parsed data to the parent component
      setFiles([]);  // Reset the file input
      setSku('');    // Reset the SKU input
    } catch (err) {
      console.error('Upload Error:', err);
      setError('Error uploading file. Please check the file format and try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* File input to handle multiple file selection */}
      <input type="file" multiple accept=".xls,.xlsx" onChange={handleFileChange} />

      {/* Display selected files (for debugging and user confirmation) */}
      {files.length > 0 && (
        <div style={{ margin: '10px 0' }}>
          <strong>Files to be uploaded:</strong>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* SKU input field */}
      <input
        type="text"
        placeholder="Enter SKU"
        value={sku}
        onChange={handleSKUChange}
        style={{ marginLeft: '10px' }}
      />

      {/* Upload button */}
      <button onClick={handleUpload} disabled={uploading} style={{ marginLeft: '10px' }}>
        {uploading ? 'Uploading...' : 'Upload Files'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FileUpload;
