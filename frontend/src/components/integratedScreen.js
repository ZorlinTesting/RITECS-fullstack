import React, { useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // For navigation to the next part
import { useTranslation } from "react-i18next";
import "../utilities/i18n";

import LoginModal from "./loginModal";

function IntegratedScreen() {
  const { t, i18n } = useTranslation();
  const [showActions, setShowActions] = useState(false);
  const navigate = useNavigate();

  // const handleConfirmation = () => {
  //   setShowActions(true); // Show the action list
  // };

  const [showModal, setShowModal] = useState(false);
  const handleLoginModal = () => {
    setShowModal(!showModal);
  };

  const handleConfirmation_demo = () => {
    const username = localStorage.getItem("username");
    console.log("username:", username);

    if (username) {
      navigate("/setup");
    } else {
      // navigate("/operator");
      handleLoginModal();
    }
  };

  // const actionRoutes = {
  //   image_button: "/images",
  //   operator_button: "/operator",
  //   setup_button: "/setup",
  // };
  // const actions = [
  //   { key: "image_button", label: t("image_button") },
  //   { key: "operator_button", label: "Operator" },
  //   { key: "setup_button", label: "Setup" },
  // ];
  // const handleActionSelect = (actionKey) => {
  //   const route = actionRoutes[actionKey];
  //   if (route) {
  //     navigate(route); // Navigate to the corresponding route
  //   } else {
  //     console.error("Route not found for action:", actionKey);
  //   }
  // };

  return (
    <Container className="mt-5">
      <h1 text-align="center">{t("welcome_message")}</h1>
      <Button
        onClick={handleConfirmation_demo}
        size="lg"
        variant="primary"
        className="my-2"
      >
        {t("start_button")}
      </Button>
      <LoginModal showModal={showModal} handleLoginModal={handleLoginModal} />
    </Container>
  );
}

export default IntegratedScreen;
