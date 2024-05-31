import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

// Function to fetch selections for a specific image
export const fetchSelections = async (imageId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/selections/${imageId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching selections:", error);
    throw error;
  }
};
