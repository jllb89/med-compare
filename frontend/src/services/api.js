import axios from 'axios';

// Use the correct Render URL for the backend
const API_BASE_URL = 'https://med-compare.onrender.com';

export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
