import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../utilities/i18n";

import LogoutComponent from "./logoutComponent";
import LoginModal from "./loginModal";

const Header = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const handleLoginModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    // Check local storage for session key
    const sessionKey = localStorage.getItem("session_key");
    // localStorage.removeItem('session_key');
    const r = localStorage.getItem("refresh");
    const a = localStorage.getItem("access");
    console.log("session_key:", sessionKey);
    console.log("r:", r);
    console.log("a:", a);
    if (sessionKey) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    localStorage.clear();
    LogoutComponent();
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <Navbar bg="light" expand="md">
      <Container>
        <Navbar.Brand href="/">
          <strong>RITECS</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/about">About</Nav.Link>
            <Nav.Link href="/contact">Contact</Nav.Link>
            {isLoggedIn && <Nav.Link href="/admin">Admin</Nav.Link>}
            {isLoggedIn ? (
              <Nav.Link href="/" onClick={handleLogoutClick}>
                Logout
              </Nav.Link>
            ) : (
              <Nav.Link
                href="#"
                onClick={(e) => {
                  e.preventDefault(); // Prevent the link from navigating
                  handleLoginModal();
                }}
              >
                Login
              </Nav.Link>
            )}
          </Nav>
          {/* <Nav>
            <Button
              variant="outline-secondary"
              onClick={() => changeLanguage("en")}
              className="ms-2"
            >
              EN
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => changeLanguage("jp")}
              className="ms-2"
            >
              JP
            </Button>
          </Nav> */}
        </Navbar.Collapse>
      </Container>
      <LoginModal showModal={showModal} handleLoginModal={handleLoginModal}/>
    </Navbar>
  );
};

export default Header;
