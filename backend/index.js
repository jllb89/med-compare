const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fileController = require('./controllers/fileController');

const app = express();

// Replace `https://med-compare-1.onrender.com` with your actual frontend Render URL
const allowedOrigins = ['https://med-compare-1.onrender.com'];

app.use(cors({
  origin: allowedOrigins,  // Only allow requests from your frontend
  methods: ['GET', 'POST'],  // Allow only GET and POST requests
  credentials: true,  // Allow credentials such as cookies or headers if needed
}));

app.use(express.json());

// Set up multer for multiple file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.array('files'), fileController.uploadFiles);  // Use `.array` for multiple files

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
