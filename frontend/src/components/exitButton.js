import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const ExitButton = ({ to }) => {
  const navigate = useNavigate();

  // For "X" button, use ❌ or a suitable icon from an icon library
  // For "<" button, use ◀️ or a suitable icon from an icon library
  const icon = "X"; // or "◀️" for back

  return (
    // <Button variant="outline-secondary" onClick={() => navigate(to)} style={{ borderRadius: '50%' }}>
    //   {icon}
    // </Button>
    <Button 
    variant="primary btn-lg" 
    onClick={() => navigate(to)}
    style={{
      position: 'relative', 
      // top: '30px', 
      // left: '30px', 
      zIndex: 1000, 
      opacity: 0.7, 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
      borderRadius: '50%' // Makes the button circular
    }}>
    &lt;
  </Button>
  );
};

export default ExitButton;
