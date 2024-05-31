import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Modal,
  Button,
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Image,
} from "react-bootstrap";

import { generateThumbnail } from "../../hooks/generateThumbnail";
import useFetchImageData from "../../hooks/useFetchImageData";

import ImageViewer from "./imageViewer";
import ActionBar from "./actionbarComponent";
import InfoBar from "./infobarComponent";

import img_clear from "../../assets/0_clear.png";
import img_cap_foil from "../../assets/1_cap_foil.png";
import img_no_tube from "../../assets/2_no_tube.png";
import img_no_cap from "../../assets/3_no_cap.png";

const ImageOperator = () => {
  // const [imageData, setImageData] = useState([]);
  let { date, thumbnailId } = useParams();

  const [username, setUsername] = useState("");
  // const date = "2024-04-15"; // Static for this example; if dynamic, ensure it's stable
  const [thumbnailCount, setThumbnailCount] = useState(0);
  const filters = useMemo(() => ({ date }), [date]);
  const selectedClassType = parseInt(thumbnailId, 10);

  const { data: images, loading, error } = useFetchImageData(filters);
  const [thumbnails, setThumbnails] = useState([]);
  const [selectedThumbnails, setSelectedThumbnails] = useState(new Set());
  const [thumbnailsSubmission, setThumbnailsSubmission] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);

  const targetThumbnails = [
    { id: 0, src: img_clear },
    { id: 1, src: img_cap_foil },
    { id: 2, src: img_no_tube },
    { id: 3, src: img_no_cap },
  ];
  // const otherThumbnails = targetThumbnails.filter(
  //   (thumbnail) => thumbnail.id !== selectedClassType
  // );
  const targetThumbnail = targetThumbnails.find(
    (thumbnail) => thumbnail.id === selectedClassType
  );

  // Function to parse and filter segmentation data
  const parseAndFilterSegmentations = (segmentation, classType) => {
    if (!segmentation || !segmentation.segmentation_data) {
      return [];  // Return an empty array if no segmentation data is present
    }

    return segmentation.segmentation_data
      .split("|")
      .map((subRegion) => {
        const parts = subRegion.split(",");
        const id = parseInt(parts[0].replace(/[^\d]/g, ""), 10);
        const classTypeFromData = parseInt(parts[1]);
        const x = parseFloat(parts[2]);
        const y = parseFloat(parts[3]);
        const width = parseFloat(parts[4]);
        const height = parseFloat(parts[5]);

        return { id, classType: classTypeFromData, x, y, width, height };
      })
      .filter((segment) => segment.classType === classType);
  };

  // const parseAndFilterSegmentations = (segmentations, classType) => {
  //   return segmentations.flatMap((segmentation) =>
  //     segmentation.segmentation_data
  //       .split("|")
  //       .map((subRegion) => {
  //         const parts = subRegion.split(",");
  //         const id = parseInt(parts[0].replace(/[^\d]/g, ""), 10);
  //         const classTypeFromData = parseInt(parts[1]);
  //         const x = parseFloat(parts[2]);
  //         const y = parseFloat(parts[3]);
  //         const width = parseFloat(parts[4]);
  //         const height = parseFloat(parts[5]);

  //         return { id, classType: classTypeFromData, x, y, width, height };
  //       })
  //       .filter((segment) => segment.classType === classType)
  //   );
  // };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Update imageData when images data changes
  // useEffect(() => {
  //   if (images) {
  //     setImageData(images);
  //   }
  // }, [images]);

  // Effect to process images when they are fetched
  useEffect(() => {
    const processThumbnails = async () => {
      setIsLoading(true);
      setHasError(null);

      if (!loading && images) {
        // Extract the results array if the response is paginated
        const imageResults = images.results || images;

        if (imageResults.length > 0) {
          const thumbnailPromises = imageResults.flatMap((imageData) => {
            const segments = parseAndFilterSegmentations(
              imageData.segmentation,
              selectedClassType
            );
            // Generate promises for thumbnail creation and associate them with their image and segment IDs
            return segments.map((segment) =>
              generateThumbnail(imageData.image_url, segment).then(
                (thumbnailUrl) => ({
                  imageId: imageData.id,
                  segmentId: segment.id,
                  thumbnailUrl,
                })
              )
            );
          });

          try {
            // Resolve all thumbnail promises and set the thumbnails state with associated data
            const thumbnailData = await Promise.all(thumbnailPromises);
            setThumbnails(thumbnailData); // This is now an array of { imageId, segmentId, thumbnailUrl } objects
            console.log(`Processed ${thumbnailData.length} thumbnails.`);
          } catch (error) {
            console.error("Error generating thumbnails:", error);
            setHasError(error.message);
          } finally {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    processThumbnails();
  }, [images, loading, selectedClassType]);


  // Callbacks for selections
  const handleThumbnailSelect = (thumbnail) => {
    setSelectedThumbnails((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(thumbnail.thumbnailUrl)) {
        newSelected.delete(thumbnail.thumbnailUrl);
      } else {
        newSelected.add(thumbnail.thumbnailUrl);
      }
      return newSelected;
    });
  };

  useEffect(() => {
    setThumbnailCount(selectedThumbnails.size);
  }, [selectedThumbnails]);

  useEffect(() => {
    // Map selected thumbnail URLs to their full object data
    const selectedThumbnailObjects = thumbnails.filter(thumbnail =>
      selectedThumbnails.has(thumbnail.thumbnailUrl)
    );
    setThumbnailsSubmission(selectedThumbnailObjects);
  }, [selectedThumbnails, thumbnails]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    //   {/* <SelectionPanel selectedThumbnails={Array.from(selectedThumbnails)} /> */}

    <Container
      fluid
      className="p-0 vh-100 d-flex flex-column justify-content-between"
      style={{ backgroundColor: "#f8f9fa" }} //Light Gray
    >
      <InfoBar
        username={username}
        date={date}
        thumbnailCount={thumbnailCount}
        targetThumbnail={targetThumbnail}
      />
      <Container
        fluid
        className="flex-grow-1 overflow-auto"
        style={{ backgroundColor: "#f5f5dc" }} //Beige
      >
        <Row className="justify-content-center align-items-center h-100">
          <Col
            md={10}
            className="d-flex justify-content-center"
            style={{ paddingTop: "10px", paddingBottom: "35px" }}
          >
            <ImageViewer
              thumbnails={thumbnails}
              selectedThumbnails={selectedThumbnails}
              onSelect={handleThumbnailSelect}
              isLoading={isLoading}
              hasError={hasError}
            />
          </Col>
        </Row>
      </Container>
      <ActionBar username={username} date={date} thumbnailCount={thumbnailCount} thumbnailsSubmission={thumbnailsSubmission} />
    </Container>
  );
};

export default ImageOperator;
