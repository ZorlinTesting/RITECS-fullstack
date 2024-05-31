import axios from '../utilities/axiosConfig';

const LoginService = async (username, password) => {
  const url = "/login/";
  const data = {
    username: username,
    password: password,
  };
  console.log(data);

  try {
    const response = await axios.post(url, data);
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);
    localStorage.setItem("session_key", response.data.session_key);

    return response.data; // Assuming the backend sends back a token or user data
  } catch (error) {
    console.error("Login error:", error.response || error.message);
    throw error; // Rethrowing the error or you might handle it differently
  }
};

export default LoginService;
