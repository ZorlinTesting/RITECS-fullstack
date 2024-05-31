import { useParams } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Image, ListGroup, Button } from "react-bootstrap";

import { useImage } from "../../utilities/imageContext";
import ImageViewer from "./imageViewer";
import useFetchSingleImage from "../../hooks/useFetchSingleImage";

// import { useParams } from 'react-router-dom';

import { useNavigate } from "react-router-dom"; // For navigation to the next part

import "../../App";

import { useTranslation } from "react-i18next";
import "../../utilities/i18n";

const ImageDetailView = () => {
  const { t, i18n } = useTranslation();
  const { images, setImages } = useImage();
  const { imageId } = useParams();
  const navigate = useNavigate();
  const {
    data: singleImageData,
    loading,
    error,
  } = useFetchSingleImage(imageId);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    // Attempt to find the image from context first, ensuring images is truthy and an array
    if (Array.isArray(images)) {
      const imageFromContext = images.find(
        (image) => image.id === Number(imageId)
      );
      if (imageFromContext) {
        setImageData(imageFromContext);
      }
    }
  }, [images, imageId]);

  useEffect(() => {
    // If imageData is not found in the context, check if it's been fetched individually
    if (!imageData && singleImageData) {
      setImageData(singleImageData);
      // Optionally update the context with this new data
      // setImages((prevImages) => [...prevImages, singleImageData]);
    }
  }, [singleImageData, imageData, setImages]);

  const handleActionSelect = (action) => {
    navigate(`/images/${imageId}/${action}`);
  };

  if (loading)
    return (
      <Container className="mt-4">
        <p>{t("loading_message")}</p>
      </Container>
    );
  if (error)
    return (
      <Container className="mt-4">
        <p>{t("no_image_error")}</p>
      </Container>
    );
  if (!imageData)
    return (
      <Container className="mt-4">
        <p>{t("no_image_error")}</p>
      </Container>
    );

  // Function to render metadata fields
  const renderMetadataFields = (metadata) => {
    return Object.entries(metadata).map(([key, value], index) => (
      <ListGroup.Item key={index}>
        <strong>{key}:</strong> {value}
      </ListGroup.Item>
    ));
  };

  // Function to render segmentation data
  const renderSegmentations = (segmentation) => {
    // if (!segmentation) return null;  // Guard clause if there's no segmentation data

  return (
    <ListGroup.Item key={segmentation.id}>
      <strong>{t("segmentation_data")}:</strong>
      <span className="segmentation-data">
        {segmentation.segmentation_data}
      </span>
    </ListGroup.Item>
  );

    // return segmentations.map((segmentation) => (
    //   <ListGroup.Item key={segmentation.id}>
    //     <strong>{t("segmentation_data")}:</strong>
    //     <span className="segmentation-data">
    //       {segmentation.segmentation_data}
    //     </span>
    //   </ListGroup.Item>
    // ));
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col xs={12} md={8} className="mb-3">
          <Image
            src={imageData.image_url}
            alt={imageData.title || "Image"}
            fluid
          />
        </Col>
        <Col xs={12} md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              {t("file_name")}: <h3>{imageData.title}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>{t("file_description")}:</strong> <br></br>
              {imageData.description}
            </ListGroup.Item>
            {imageData.metadata && (
              <>{renderMetadataFields(imageData.metadata)}</>
            )}
            {imageData.segmentation && (
              <>{renderSegmentations(imageData.segmentation)}</>
            )}
            <ListGroup>
              <Button
                onClick={() => handleActionSelect("edit")}
                size="lg"
                variant="primary"
                className="my-2"
              >
                {t("start_selection_button")}
              </Button>
            </ListGroup>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default ImageDetailView;
