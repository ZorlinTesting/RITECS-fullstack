import React, { useState } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import submitData from "../services/submissionService";

function SubmissionComponent({ username, date, onSend, onCancel, thumbnailCount, thumbnailsSubmission }) {
  const navigate = useNavigate();
  let { thumbnailId } = useParams();

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const createGroupedSubmissionData = (thumbnailId) => {
    // Group segments by imageId
    const groupedByImageId = thumbnailsSubmission.reduce((acc, { imageId, segmentId }) => {
      // If the imageId isn't already a key in the accumulator, add it
      if (!acc[imageId]) {
        acc[imageId] = [];
      }
      // Append the segmentId to the list under the imageId key
      acc[imageId].push(segmentId);
      return acc;
    }, {});

    // Transform the object into an array of objects with imageId and segments
    return Object.keys(groupedByImageId).map(imageId => ({
      image: imageId,
      affected_segments: groupedByImageId[imageId],
      target_classType: thumbnailId  // Now each correction will have its own target_classType
    }));
  };

  const createPayload = () => {
    const currentDatetime = new Date().toISOString();
    const submissionData = createGroupedSubmissionData(thumbnailId);

    // const submissionData = thumbnailsSubmission.map(thumbnail => ({
    //   imageId: thumbnail.imageId,
    //   segmentId: thumbnail.segmentId,
    //   // thumbnailUrl is omitted as per requirement
    // }));
    

    return {
      checked_by: username,
      submission_datetime: currentDatetime,
      check_date: date,
      // target_classType: thumbnailId,
      proposed_corrections: submissionData
    };
  };

  
  const handleSubmit = () => {
    const payload = createPayload();
    console.log('Submitting:', payload);
    try {
      const response = submitData(payload);
      console.log('Submission successful:', response);
      navigate('/success');
    } catch (error) {
      console.error('Submission failed:', error);
      // Optionally show an error message to the user
    }
  
  };

  const handleSubmission = async () => {
    try {
      handleSubmit();
      // Optionally reset error state if you want to allow retrying
      setIsError(false);
      setErrorMessage('');
    } catch (error) {
      setIsError(true);
      setErrorMessage('Failed to submit data. Please try again.');
    }
  };


  return (
    <Card>
      <Card.Body>
        <Card.Title>Confirmation</Card.Title>
        <Card.Text>
          {isError ? (
            <div className="text-danger">{errorMessage}</div>
          ) : (
            <>
              <Row className="mb-3">
                <Col xs={12}>
                  <strong>Operator:</strong> {username}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={12}>
                  <strong>Checking Date:</strong> {date}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={12}>
                  <strong>Selection Count:</strong> {thumbnailCount}
                </Col>
              </Row>
            </>
          )}
        </Card.Text>
        {/* <Card.Text>
          <Row className="mb-3">
            <Col xs={12}>
              <strong>Operator:</strong> {username}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={12}>
              <strong>Checking Date:</strong> {date}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={12}>
              <strong>Selection Count:</strong> {thumbnailCount}
            </Col>
          </Row>
        </Card.Text> */}
      </Card.Body>
      <Card.Footer>
        <Row>
          <Col className="d-flex justify-content-end">
            {/* <Button variant="primary" onClick={handleSubmit} className="me-2">
              Submit
            </Button> */}
            {!isError && (
              <Button variant="primary" onClick={handleSubmission} className="me-2">
                Submit
              </Button>
            )}
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
}

export default SubmissionComponent;
