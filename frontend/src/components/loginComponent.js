import React, { useState, useEffect } from "react";
import LoginService from "../services/loginService";
import { Container, Form, FormGroup, Label, Input, Button, Alert } from 'react-bootstrap';

// const LoginComponent = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleLogin = async (event) => {
//     event.preventDefault(); // Prevent the default form submit behavior

//     try {
//       const loginData = await LoginService(username, password);
//       // Handle successful login here, like redirecting to another page or setting user context
//       window.location = "/setup"; // Redirects to home and forces a full page reload
//       localStorage.setItem('username', username)
//     } catch (error) {
//       setErrorMessage(
//         "Failed to login. Please check your credentials and try again."
//       );
//     }
//   };

//   return (
//     <Container className="mt-5">
//       <Form onSubmit={handleLogin}>
//         <Form.Group className="mb-3" controlId="formBasicUsername">
//           <Form.Label>Username:</Form.Label>
//           <Form.Control
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </Form.Group>
//         <Form.Group className="mb-3" controlId="formBasicPassword">
//           <Form.Label>Password:</Form.Label>
//           <Form.Control
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </Form.Group>
//         {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
//         <Button type="submit" variant="primary">Login</Button>
//       </Form>
//     </Container>
//   );
// };

const LoginComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [guestAccount, setGuestAccount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const guestAccountMapping = {
    "Operator 1": { username: "operator_1", password: "guest_password_1" },
    "Operator 2": { username: "operator_2", password: "guest_password_2" },
    "Operator 3": { username: "operator_3", password: "guest_password_3" }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      let loginUsername = username;
      let loginPassword = password;

      if (guestAccount) {
        loginUsername = guestAccountMapping[guestAccount].username;
        loginPassword = guestAccountMapping[guestAccount].password;
      }

      const loginData = await LoginService(loginUsername, loginPassword);
      // Handle successful login here
      window.location = "/setup"; // Redirects to home and forces a full page reload
      localStorage.setItem('username', loginUsername);
    } catch (error) {
      setErrorMessage(
        "Failed to login. Please check your credentials and try again."
      );
    }
  };

  return (
    <Container className="mt-5">
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!!guestAccount} // Disable if guest account is selected
            required={!guestAccount} // Make required only if guest account is not selected
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!!guestAccount} // Disable if guest account is selected
            required={!guestAccount} // Make required only if guest account is not selected
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicGuestAccount">
          <Form.Label>Login as Guest:</Form.Label>
          <Form.Control
            as="select"
            value={guestAccount}
            onChange={(e) => {
              setGuestAccount(e.target.value);
              setUsername(''); // Clear username and password if guest account is selected
              setPassword('');
            }}
          >
            <option value="">Select Guest Account</option>
            <option value="Operator 1">Operator 1</option>
            <option value="Operator 2">Operator 2</option>
            <option value="Operator 3">Operator 3</option>
          </Form.Control>
        </Form.Group>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Button type="submit" variant="primary">Login</Button>
      </Form>
    </Container>
  );
};


export default LoginComponent;
