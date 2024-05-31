import React from "react";
import { Alert, Container, Row, Col, Spinner } from "react-bootstrap";

// import { useTranslation } from "react-i18next";
import "../../utilities/i18n";

const ImageViewer = ({
  thumbnails,
  selectedThumbnails,
  onSelect,
  isLoading,
  hasError,
}) => {
  if (isLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading thumbnails...</span>
        </Spinner>
      </Container>
    );
  }

  if (hasError) {
    return (
      <Container>
        <Alert variant="danger">
          Error loading thumbnails: {hasError}. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      {thumbnails.length > 0 ? (
        <Row>
          {thumbnails.map((thumbnail, index) => (
            <Col key={index} xs={3} md={2} className="mb-4">
              <div
                className={`thumbnail ${
                  selectedThumbnails.has(thumbnail.thumbnailUrl)
                    ? "selected"
                    : ""
                }`}
                onClick={() => onSelect(thumbnail)}
                id={`thumbnail-${index}`}
              >
                <img
                  src={thumbnail.thumbnailUrl}
                  alt={`Thumbnail ${thumbnail.segmentId}`}
                  className="thumbnail-img"
                />
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info">
          No thumbnails available. Please check back later or contact support.
        </Alert>
      )}
    </Container>
  );
};

export default ImageViewer;
