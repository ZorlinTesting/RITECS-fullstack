import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Container, Navbar } from "react-bootstrap";
import SubmissionComponent from "../submissionComponent";
import FullScreenToggle from "../fullscreenComponent";

const ActionBar = ({ username, date, thumbnailCount, thumbnailsSubmission }) => {
  const [showModal, setShowModal] = useState(false);
  const handleSubmitModal = () => {
    setShowModal(!showModal);
  };
  const navigate = useNavigate();

  const [showInstructionModal, setShowInstructionModal] = useState(false);
  useEffect(() => {
    setShowInstructionModal(true);
  }, []);

  return (
    <Container>
      <Navbar fixed="bottom" bg="dark" variant="dark" className="shadow-lg">
        <Container className="justify-content-around">
          <Button variant="secondary" onClick={() => navigate("/setup")}>
            <FontAwesomeIcon icon={faXmark} />
          </Button>
          <Button variant="primary" onClick={handleSubmitModal}>
            Submit
          </Button>
          <FullScreenToggle />
        </Container>
      </Navbar>
      <Modal show={showModal} onHide={handleSubmitModal}>
        <Modal.Body>
          <SubmissionComponent
            username={username}
            date={date}
            onCancel={handleSubmitModal}
            thumbnailCount={thumbnailCount}
            thumbnailsSubmission={thumbnailsSubmission}
          />
        </Modal.Body>
      </Modal>
      <Modal
        show={showInstructionModal}
        onHide={() => setShowInstructionModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Instruction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please select all images that match the Target.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => setShowInstructionModal(false)}
          >
            Got it!
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ActionBar;
