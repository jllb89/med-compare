import React from 'react';

const ComparisonResults = ({ results, sku }) => {
    return (
        <div style={{ marginTop: '30px' }}> 
            <h2>Comparison Results for SKU: {sku}</h2>
            {results.map((result) => (
                <div key={result.fileIndex} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                    <h3>File {result.fileIndex}</h3>
                    <p><strong>SKU:</strong> {result.SKU}</p>
                    <p><strong>Price:</strong> {result.Price}</p>
                    {/* Add other properties as needed */}
                </div>
            ))}
        </div>
    );
};

export default ComparisonResults;
