import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import LoginComponent from "./loginComponent";

function LoginModal({ showModal, onHide, handleLoginModal }) {
    return (
        <Modal show={showModal} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* <LoginComponent onClose={handleLoginModal} /> */}
                <LoginComponent onLogin={handleLoginModal} />
            </Modal.Body>
            {/* <Modal.Footer></Modal.Footer> */}
        </Modal>
    );
}

export default LoginModal;
