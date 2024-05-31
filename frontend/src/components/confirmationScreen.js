import React from 'react';
import { Alert, Container } from 'react-bootstrap';
import ExitButton from "./exitButton";

const ConfirmationComponent = () => {
  const backPath = `/`;

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <ExitButton to={backPath} />
      <Alert variant="info" className="text-center">
        Your input has been submitted. Thank you!
      </Alert>
    </Container>
  );
};

export default ConfirmationComponent;
