import React from 'react';

const ComparisonResults = ({ results, sku }) => {
    return (
        <div style={{ marginTop: '30px' }}> 
            <h2>Resultados: {sku}</h2>
            {results.map((result) => (
                <div key={result.fileIndex} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                    <h3>Archivo {result.fileIndex}</h3>
                    <p><strong>Valor:</strong> {result.SKU}</p>
                    <p><strong>Precio:</strong> {result.Price}</p>
                    {/* Add other properties as needed */}
                </div>
            ))}
        </div>
    );
};

export default ComparisonResults;
