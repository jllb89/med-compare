const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fileController = require('./controllers/fileController');

const app = express();
app.use(cors());
app.use(express.json());

// Set up multer for multiple file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.array('files'), fileController.uploadFiles);  // Note: Using `.array` for multiple files

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
