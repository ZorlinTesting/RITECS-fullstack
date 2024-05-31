import React, { useState } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Figure,
} from "react-bootstrap";
import sample_correct_image from "../assets/sample_correct_image.png";

import submissionService from "../services/submissionService";

import { useTranslation } from "react-i18next";
import "../utilities/i18n";

function SelectionPanel({ segmentThumbnails, imageId }) {
  const { t } = useTranslation();
  const today = new Date().toISOString().split("T")[0];
  // Placeholder content - adapt based on your actual data structure and requirements

  // State to control the visibility of the submission confirmation
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [alertContent, setAlertContent] = useState("");

  const classTypeDescriptions = {
    0: t("state_0"),
    1: t("state_1"),
    2: t("state_2"),
    3: t("state_3"),
  };

  // // Handle submit
  // const handleSubmit = () => {
  //   // Assuming each segment includes a boolean indicating if it is selected
  //   const selectedSegmentIds = segmentThumbnails
  //     .filter((segment) => segment.isSelected) // This requires that segments have an `isSelected` property
  //     .map((segment) => segment.id)
  //     .join(", ");

  //   console.log("Submit button clicked with selections:", selectedSegmentIds);
  //   setShowConfirmation(true); // Show confirmation alert
  //   // Optionally reset the alert visibility after a delay
  //   setTimeout(() => setShowConfirmation(false), 5000); // Hide after 5 seconds
  // };

  const user = 1; // This should come from your user authentication context or state

  const handleSubmit = () => {
    const proposed_corrections = segmentThumbnails.map((segment) => ({
      sub_region_id: segment.id,
      initial_classType: segment.classType,
      actual_classType: 0, // Default value as actual_classType mechanism isn't implemented yet
    }));

    const submissionData = {
      image_id: imageId,
      checked_by: user,
      proposed_corrections,
    };

    // console.log(submissionData);
    submissionService.submit(submissionData);

    // Format alert content
    const formattedCorrections = submissionData.proposed_corrections
      .map(
        (correction) =>
          `\nID: ${correction.sub_region_id}, Initial: ${correction.initial_classType}, Actual: ${correction.actual_classType}`
      )
      .join("; ");
    // console.log(formattedCorrections);
    const content = t("alert_message", { corrections: formattedCorrections });
    setAlertContent(content);

    setShowConfirmation(true); // Show confirmation alert
    setTimeout(() => setShowConfirmation(false), 5000); // Hide after 5 seconds
  };

  return (
    <div className="selection-panel">
      <Card style={{ height: "100%" }}>
        <Card.Header>
          {showConfirmation && (
            <Alert
              variant="success"
              onClose={() => setShowConfirmation(false)}
              dismissible
              className="alert-middle-viewport"
            >
              {alertContent}
            </Alert>
          )}
          <div>
            {t("current_date")}:{" "}
            <input type="date" className="form-control" defaultValue={today} />
          </div>
        </Card.Header>

        <Card.Header>
          <Row>
            <Col xs={12} className="mb-2">
              <Alert variant="primary">
                <strong>{t("instruction_label")}:</strong>{" "}
                <em>{t("instruction_message")}</em>
              </Alert>
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="text-center mb-2">
              <h5>{t("sample_label")}:</h5>
              <Figure>
                <Figure.Image
                  width={171} // Set appropriate width
                  height={180} // Set appropriate height
                  alt="Sample correct"
                  src={sample_correct_image}
                  className="sample-image mx-auto d-block"
                />
              </Figure>
            </Col>
          </Row>
        </Card.Header>
        <Card.Header className="selection-panel-header">
          {t("selection_label")}:
        </Card.Header>
        <Card.Body
          className="selection-panel-body"
          style={{ width: "18rem", height: "100%", overflowY: "scroll" }}
        >
          {segmentThumbnails.map(({ id, classType, thumbnailUrl }) => {
            // Determine the text for the current item's classType
            const classTypeText = classTypeDescriptions[classType] || "Unknown";

            return (
              <Card key={id} className="mb-3">
                <Row noGutters className="align-items-center">
                  <Col>
                    <Card.Img
                      src={thumbnailUrl}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </Col>
                  <Col xs={8}>
                    <Card.Text>
                      {t("segment_label")}: <strong>{id}</strong> <br></br>
                      {t("state_label")}: <em>{classTypeText}</em>
                    </Card.Text>
                  </Col>
                </Row>
              </Card>
            );
          })}
        </Card.Body>
        <Card.Footer className="selection-panel-footer text-end">
          <Button onClick={handleSubmit} className="btn btn-primary">
            {t("submit_button")}
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default SelectionPanel;
