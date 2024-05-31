// import axios from "axios";
import axios from '../utilities/axiosConfig';

// const BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const getSingleData = async (imageId) => {
  console.log("Starting API call to fetch SINGLE image data..."); // Indicates the start of an API call
  try {
    // const response = await axios.get(`${BASE_URL}/api/images/${imageId}/`, {
    // // const response = await axios.get(`/api/images/${imageId}/`, {
    //   headers: {
    //     Authorization: `Api-Key ${process.env.REACT_APP_API_KEY}`,
    //   },
    // });
    const response = await axios.get(`/images/${imageId}/`);

    console.log("API call successful!"); // Indicates the API call was successful
    console.log("Fetched single image data:", response.data); // Prints relevant response data
    return response.data;
  } catch (error) {
    console.error("Failed to fetch image data:", error);
    throw error;
  }
};
