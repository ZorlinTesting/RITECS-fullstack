import React from 'react';
import { Alert, Container } from 'react-bootstrap';
import ExitButton from "./exitButton";

const RedirectComponent = () => {
  const backPath = `/`;

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <ExitButton to={backPath} />
      <Alert variant="warning" className="text-center">
        Please log-in to continue.
      </Alert>
    </Container>
  );
};

export default RedirectComponent;
