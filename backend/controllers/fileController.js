const xlsx = require('xlsx');
const fs = require('fs-extra');
const path = require('path');
const stringSimilarity = require('string-similarity');

const normalizeString = (value) => {
  return value ? value.toString().trim().toLowerCase().replace(/[\s\W_]+/g, '') : '';
};

exports.uploadFiles = async (req, res) => {
  try {
    const files = req.files;
    const rawSku = req.body.sku.trim().toLowerCase();  // Normalize the input SKU for comparison
    const normalizedSku = normalizeString(rawSku);     // Apply advanced normalization

    console.log("=== Start of File Processing ===");
    console.log("Uploaded files:", files);
    console.log("Requested SKU:", rawSku, "(Normalized:", normalizedSku, ")");

    if (!files || files.length === 0) {
      console.log("No files uploaded.");
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    if (!normalizedSku) {
      console.log("No SKU provided.");
      return res.status(400).json({ message: 'No SKU provided.' });
    }

    let matchedResults = [];

    for (const file of files) {
      console.log(`Processing file: ${file.originalname}`);

      try {
        // Read the Excel file using the `xlsx` library
        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        console.log(`Parsed JSON data from file (${file.originalname}):`, JSON.stringify(data, null, 2));

        // Store multiple matches for this file
        let fileMatches = [];

        // Search for the specified SKU in each row of the file (normalize all values)
        data.forEach((row) => {
          const match = Object.values(row).some((value) => {
            const normalizedValue = normalizeString(value);  // Normalize each cell value
            return normalizedValue.includes(normalizedSku) || stringSimilarity.compareTwoStrings(normalizedSku, normalizedValue) >= 0.8;
          });

          if (match) {
            fileMatches.push(row);  // Add the matched row to the file's matches
          }
        });

        if (fileMatches.length > 0) {
          matchedResults.push({
            sku: rawSku,
            details: fileMatches,  // Store all matches for this file in an array
            filename: file.originalname,
          });
        }

        await fs.remove(file.path);
      } catch (fileError) {
        console.error(`Error processing file ${file.originalname}:`, fileError);
      }
    }

    console.log("=== End of File Processing ===");
    console.log("Matched Results:", JSON.stringify(matchedResults, null, 2));

    // Send back the grouped matching results
    res.json(matchedResults);
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).json({ message: 'Server error while processing the files.' });
  }
};
