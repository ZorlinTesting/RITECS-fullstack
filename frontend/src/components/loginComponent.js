import React, { useState } from "react";
import LoginService from "../services/loginService";
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const LoginComponent = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [guestAccount, setGuestAccount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const navigate = useNavigate();

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
      console.log(loginData);
      // Handle successful login here
      // window.location = "/setup"; // Redirects to home and forces a full page reload
       // Redirect based on user type
       if (isAdmin) {
        window.location = "/admin";
      } else {
        window.location = "/setup";
      }
      localStorage.setItem('username', loginUsername);
      localStorage.setItem('is_staff', loginData.is_staff);
      onLogin(); // Call the onLogin prop to notify parent component
    } catch (error) {
      setErrorMessage(
        "Failed to login. Please check your credentials and try again."
      );
    }
  };

  return (
    <Container className="mt-5">
      <Form onSubmit={handleLogin}>
        {isAdmin ? (
          <>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
          </>
        ) : (
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
        )}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Button type="submit" variant="primary">Login</Button>
      </Form>
    </Container>
  );
};


export default LoginComponent;
