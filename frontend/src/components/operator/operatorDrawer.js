import { Button, Offcanvas, Card } from "react-bootstrap";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const DetailDrawer = ({ date, username, thumbnailCount }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="info" onClick={handleShow}>
        <FontAwesomeIcon icon={faCircleInfo} />
      </Button>
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        style={{ width: "70%" }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Additional Details</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card style={{ marginBottom: "10px" }}>
            <Card.Body>
              <p>
                <strong>Operator:</strong> {username}
              </p>
              <p>
                <strong>Checking Date:</strong> {date}
              </p>
              <p>
                <strong>Selection Count:</strong> {thumbnailCount}
              </p>
            </Card.Body>
          </Card>

          {/* Add more details as needed */}
          <Card className="p-3">
            <Card.Title>Instruction:</Card.Title>
            <Card.Body>
              Please select all image thumbnails that match the Target.
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default DetailDrawer;
