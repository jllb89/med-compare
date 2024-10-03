import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
