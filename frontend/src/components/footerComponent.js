import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="mt-auto py-3 bg-light">
      <Container>
        <Row>
          <Col className="text-center">
            <span>© 2024 RITECS, Inc. All rights reserved.</span>
          </Col>
        </Row>
        {/* Add additional rows and columns as needed for more footer content */}
      </Container>
    </footer>
  );
};

export default Footer;
