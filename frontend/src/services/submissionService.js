import axios from '../utilities/axiosConfig';
// const BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

// const submissionService = {
//   lastSubmissionTime: null,

//   async submit(submissionData) {
//     const currentTime = Date.now();
//     const submissionThreshold = 3000; // 3 seconds threshold

//     if (this.lastSubmissionTime && currentTime - this.lastSubmissionTime < submissionThreshold) {
//       console.error('Submission attempt too soon. Please wait before resubmitting.');
//       return;
//     }

//     try {
//       // const response = await axios.post('/api/checks/', submissionData);
//       const response = await axios.post(`/api/checks/`, submissionData);
//       console.log('Submission successful', response.data);
//       this.lastSubmissionTime = currentTime;
//     } catch (error) {
//       console.error('Error during submission:', error.response ? error.response.data : error.message);
//     }
//   },
// };

// export default submissionService; 

// Function to post submission data to the backend
const submitData = async (payload) => {
  try {
    const response = await axios.post('/corrections/', payload);
    return response.data; // Return the response data to the caller
  } catch (error) {
    console.error('Error submitting data:', error.response || error.message);
    throw error; // Rethrow to handle it in the UI layer
  }
};

export default submitData;