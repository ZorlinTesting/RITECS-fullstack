// An imageService.js file in the /src/services/ directory might have a function fetchImageData()
// that makes a GET request to /api/image-data and returns the JSON response.

// import axios from "axios";
// const BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

import axios from '../utilities/axiosConfig';

export const getImageData = async (filters = {}) => {
  console.log("Starting API call to fetch image data..."); // Indicates the start of an API call
  try {
    const queryParams = new URLSearchParams(filters).toString();
    // const url = `${BASE_URL}/api/images/${
    //   queryParams ? `?${queryParams}` : ""
    // }`;
    // const response = await axios.get(url, {
    //   headers: {
    //     Authorization: `Api-Key ${process.env.REACT_APP_API_KEY}`,
    //   },
    // });
    const response = await axios.get(`/images${queryParams ? `?${queryParams}&no_page=true` : '?no_page=true'}`);
    console.log("API call successful!"); // Indicates the API call was successful
    console.log("Fetched image data:", response.data); // Prints relevant response data
    return response.data;
  } catch (error) {
    console.error("Failed to fetch image data:", error);
    throw error;
  }
};

// A useFetchImageData hook that calls imageService.fetchImageData()
// and stores the returned data, along with any loading or error states.
