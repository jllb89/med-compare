import axios from 'axios';

// Update the base URL to point to your Render backend
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
