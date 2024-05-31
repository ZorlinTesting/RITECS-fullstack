import axios from '../utilities/axiosConfig';

// export const getAvailableDates = async () => {
//   try {
//     const response = await axios.get(`/api/dates/`);
//     return response.data;
//   } catch (error) {
//     console.error('Failed to fetch available dates:', error);
//     throw error;
//   }
// };

// export const getAvailableDates = async (machineNumber) => {
//   try {
//     const response = await axios.get(`/api/dates/`, {
//       params: {
//         machine_number: machineNumber
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Failed to fetch available dates:', error);
//     throw error;
//   }
// };

export const getAvailableDates = async (machineNumber, titleKeyword) => {
  try {
    // Create an object to conditionally include parameters
    const params = {};
    if (machineNumber && machineNumber.length > 0) {
      params.machine_name = machineNumber.join(',');
    }
    if (titleKeyword) {
      params.title_contains = titleKeyword;
    }


    const response = await axios.get(`/dates/`, { params });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch available dates:', error);
    throw error;
  }
};
