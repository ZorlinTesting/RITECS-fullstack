// logoutService.js
import axios from '../utilities/axiosConfig';

const logoutService = async () => {
    // Perform any backend logout operations if necessary
    try {
      const refresh = localStorage.getItem('refresh');
      const sessionKey = localStorage.getItem('session_key');
      const data = {
        refresh: refresh,
        session_key: sessionKey,
      };
      console.log("outgoing_data:", data);
      // await axios.post('/api/logout/', data);
      await axios.post('/logout/', data);

      // // Remove the data from localStorage
      // localStorage.removeItem('refresh');
      // localStorage.removeItem('access');
      // localStorage.removeItem('session_key');
      window.location = '/'; // Redirects to home and forces a full page reload
    } catch (error) {
      console.error('Logout error:', error.response || error.message);
      throw error;
    }
  };
  
  export default logoutService;
  