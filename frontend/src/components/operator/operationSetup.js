import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CalendarComponent from "./calendarComponent";
import LogoutComponent from "../logoutComponent";
import MachineSelectionModal from "./machineSelection";

import { Button, Container, Row, Col, Image, Card } from "react-bootstrap";

import img_clear from "../../assets/0_clear.png";
import img_cap_foil from "../../assets/1_cap_foil.png";
import img_no_tube from "../../assets/2_no_tube.png";
import img_no_cap from "../../assets/3_no_cap.png";

import moment from 'moment-timezone';


function OperationSetup() {
  const [username, setUsername] = useState("");
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [machineNumber, setMachineNumber] = useState(null);
  const [titleKeyword, setTitleKeyword] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleModalClose = () => setShowModal(false);
  const handleModalOpen = () => setShowModal(true);

  const handleLogoutClick = () => {
    // Implement your logout logic here
    localStorage.clear();
    LogoutComponent();
    navigate("/"); // Adjust if the route differs
  };

  const handleStart = () => {
    console.log(selectedDate, selectedThumbnail);
    if (
      !selectedDate ||
      selectedThumbnail === null ||
      selectedThumbnail === undefined
    ) {
      console.error("Both date and thumbnail must be selected.");
      return; // Prevent navigation
    }

    // // Format the date as needed before navigation
    // const dateWithCorrectTimezone = new Date(
    //   selectedDate.getFullYear(),
    //   selectedDate.getMonth(),
    //   selectedDate.getDate()
    // );
    // const formattedDate = dateWithCorrectTimezone
    //   .toISOString()
    //   .substring(0, 10);
    // console.log(formattedDate, selectedThumbnail);
    // Convert the selected date back to Asia/Tokyo timezone
    const tokyoDate = moment(selectedDate).tz('Asia/Tokyo');
    const formattedDate = tokyoDate.format('YYYY-MM-DD');
    console.log(formattedDate, selectedThumbnail);
    // Navigate to the imageOperator component with the selected date
    navigate(`/operator/${formattedDate}/${selectedThumbnail}`);
    // navigate("/operator");
  };

  const thumbnails = [
    { id: 0, src: img_clear },
    { id: 1, src: img_cap_foil },
    { id: 2, src: img_no_tube },
    { id: 3, src: img_no_cap },
  ];

  return (
    <Container style={{ marginTop: "10px" }}>
      <MachineSelectionModal
        show={showModal}
        handleClose={handleModalClose}
        setMachineNumber={setMachineNumber}
        setTitleKeyword={setTitleKeyword}
      />
      <Row className="mb-3">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Operation Setup</h3>
                    <Button variant="primary" onClick={handleModalOpen}>
                      Select Machine
                    </Button>
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <p>Operator: {username}</p>
                  </div>
                </div>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          {/* <CalendarComponent
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          /> */}
          {machineNumber && (
            <CalendarComponent
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              machineNumber={machineNumber}
              titleKeyword={titleKeyword}
            />
          )}
        </Col>
        <Col>
          <Card className="p-3 pad-top-sm" style={{ minHeight: "300px" }}>
            <Card.Title>
              <h4>Target Object</h4>
            </Card.Title>
            <Card.Body>
              <p>Please select target object:</p>
              <Row>
                {thumbnails.map((thumbnail, index) => (
                  <Col
                    lg={3}
                    md={6}
                    xs={3}
                    className="mb-2 d-flex justify-content-center"
                    key={thumbnail.id}
                  >
                    <Image
                      src={thumbnail.src}
                      thumbnail
                      className={`img-thumbnail ${selectedThumbnail === thumbnail.id
                          ? "selected-thumbnail"
                          : ""
                        }`}
                      onClick={() => setSelectedThumbnail(thumbnail.id)}
                      style={{ width: "100%", height: "100%" }} // Fixed size for thumbnails
                    />
                  </Col>
                ))}
              </Row>
            </Card.Body>
            {/* <Card.Title>
              <h4>Machine Selection</h4>
            </Card.Title>
            <Card.Body>
              <p>(Optional): Change the selected Machine</p>
              <Button variant="primary" onClick={handleModalOpen}>
                Select Machine
              </Button>
            </Card.Body> */}
          </Card>
        </Col>
      </Row>

      <Row className="mb-3 justify-content-center">
        <Col className="d-flex justify-content-center">
          {/* <Button variant="primary" onClick={handleStart} className="me-2">
            Start
          </Button> */}
          <Button
            variant="primary"
            onClick={handleStart}
            className="me-2"
            disabled={
              selectedThumbnail === null ||
              selectedThumbnail === undefined ||
              !selectedDate
            } // Explicit check for null or undefined
          >
            Start
          </Button>
          <Button variant="secondary" onClick={handleLogoutClick}>
            Logout
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default OperationSetup;
