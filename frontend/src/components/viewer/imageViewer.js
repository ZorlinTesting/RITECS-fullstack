import React, { useState, useRef, useEffect } from "react";
import { throttle } from "lodash";

import { useParams } from "react-router-dom";
import { useImage } from "../../utilities/imageContext"; // Adjust path as needed
// import { fetchSelections } from '../services/selectionServiceSingle'; // Adjust path as needed
import SelectionPanel from "../selectionPanel";
import ExitButton from "../exitButton";

// import { useTranslation } from "react-i18next";
import "../../utilities/i18n";

const ImageViewer = () => {
  // const { t, i18n } = useTranslation();
  const { images } = useImage(); // Assuming imageData includes segmentations
  // const { images, setImages } = useImage(); // Assuming imageData includes segmentations
  const { imageId } = useParams();
  const canvasRef = useRef(null);
  //const { data: singleImageData, loading, error } = useFetchSingleImage(imageId);
  const [imageData, setImageData] = useState(null);
  const [selectedSegmentIds, setSelectedSegmentIds] = useState([]);
  const [segmentThumbnails, setSegmentThumbnails] = useState([]);
  const [hoveredSegmentId, setHoveredSegmentId] = useState(null);

  // Initialize image reference for use in the two useEffects
  const imageRef = useRef(new Image());
  const preparedSegmentationsRef = useRef([]);

  const backPath = `/images/${imageId}/`;

  // #region FUNCTIONS //
  // Parse received data into segmentation array
  // const parseSegmentationData = (segmentations) => {
  //   return segmentations.flatMap((segmentation) =>
  //     segmentation.segmentation_data.split("|").map((subRegion) => {
  //       const parts = subRegion.split(",");

  //       // Convert the ID to a number explicitly and handle potential formatting issues
  //       const id = parseInt(parts[0].replace(/[^\d]/g, ""), 10); // Remove non-digit characters before parsing

  //       const classType = parseInt(parts[1]);
  //       const x = parseFloat(parts[2]);
  //       const y = parseFloat(parts[3]);
  //       const width = parseFloat(parts[4]);
  //       const height = parseFloat(parts[5]);

  //       // Include classType in the output for potential use
  //       return { id, classType, x, y, width, height };
  //     })
  //   );
  // };
  const parseSegmentationData = (segmentation) => {
    return segmentation.segmentation_data
    .split("|")
    .map((subRegion) => {
        const parts = subRegion.split(",");

        // Convert the ID to a number explicitly and handle potential formatting issues
        const id = parseInt(parts[0].replace(/[^\d]/g, ""), 10); // Remove non-digit characters before parsing

        const classType = parseInt(parts[1]);
        const x = parseFloat(parts[2]);
        const y = parseFloat(parts[3]);
        const width = parseFloat(parts[4]);
        const height = parseFloat(parts[5]);

        // Include classType in the output for potential use
        return { id, classType, x, y, width, height };
      });
  };

  // Function to draw segmentations
  const drawSegmentations = (selectedIds, hoveredId) => {
    // console.log("Selected Segment IDs:", selectedIds);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const segmentations = preparedSegmentationsRef.current;

    if (!canvas || !imageRef.current || segmentations.length === 0) {
      console.log("No canvas, image, or segmentations available.");
      return;
    }

    // Draw each segmentation with updated colors based on state
    segmentations.forEach((segment) => {
      const absoluteX = segment.x * canvas.width; // Adjusted for canvas size
      const absoluteY = segment.y * canvas.height;
      const absoluteWidth = segment.width * canvas.width;
      const absoluteHeight = segment.height * canvas.height;

      ctx.beginPath();
      ctx.rect(absoluteX, absoluteY, absoluteWidth, absoluteHeight);
      ctx.lineWidth = 3; // Increase line width as needed

      // Determine stroke color based on conditions
      if (selectedIds.includes(segment.id)) {
        ctx.strokeStyle = "#9B30FF"; // Selected - highest priority
      } else if (segment.id === hoveredId) {
        ctx.strokeStyle = "blue"; // Hovered - second priority
      } else {
        // Color based on classType - third priority
        switch (segment.classType) {
          case 0:
            ctx.strokeStyle = "#00FF00"; // No issue - bright green
            break;
          case 1:
            ctx.strokeStyle = "#FFFF00"; // Non-issue item - yellow
            break;
          case 2:
            ctx.strokeStyle = "#FFA500"; // Minor issue - orange
            break;
          case 3:
            ctx.strokeStyle = "#FF0000"; // Major issue - red
            break;
          default:
            ctx.strokeStyle = "#00FF00"; // Default color if none of the above conditions are met
        }
      }

      // Draw the bounding box
      ctx.stroke();
    });
  };

  // Function to capture click-selected thumbnails
  const captureThumbnail = (segment) => {
    // console.log(`Drawing segment:`, segment);
    const absoluteX = segment.x * imageRef.current.naturalWidth;
    const absoluteY = segment.y * imageRef.current.naturalHeight;
    const absoluteWidth = segment.width * imageRef.current.naturalWidth;
    const absoluteHeight = segment.height * imageRef.current.naturalHeight;

    const offScreenCanvas = document.createElement("canvas");
    offScreenCanvas.width = absoluteWidth;
    offScreenCanvas.height = absoluteHeight;
    const ctx = offScreenCanvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get 2D context");
      return;
    }
    // console.log(`Absolute X: ${absoluteX}`);
    // console.log(`Absolute Y: ${absoluteY}`);
    // console.log(`Absolute Width: ${absoluteWidth}`);
    // console.log(`Absolute Height: ${absoluteHeight}`);

    ctx.drawImage(
      imageRef.current, // Source image
      absoluteX, // x coordinate where to start clipping
      absoluteY, // y coordinate where to start clipping
      absoluteWidth, // width of the clipped image
      absoluteHeight, // height of the clipped image
      0, // x coordinate where to place the image on the canvas
      0, // y coordinate where to place the image on the canvas
      absoluteWidth, // width to which to scale the clipped image
      absoluteHeight // height to which to scale the clipped image
    );
    const dataUrl = offScreenCanvas.toDataURL();
    // console.log(`Thumbnail data URL for segment ${segment.id}:`, dataUrl); // Debug statement
    return dataUrl;
  };
  // #endregion

  // #region HOOKS //
  // Attempt to find the image from context first, ensuring images is truthy and an array
  useEffect(() => {
    if (Array.isArray(images)) {
      const imageFromContext = images.find(
        (image) => image.id === Number(imageId)
      );
      if (imageFromContext) {
        setImageData(imageFromContext);
      }
    }
  }, [images, imageId]);

  // For drawing the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) return;

    const ctx = canvas.getContext("2d");
    const image = imageRef.current;
    if (!image.crossOrigin) {
      image.crossOrigin = "anonymous"; // This should be set right after image creation
    }
    image.src = imageData.image_ref;
    image.onload = () => {
      console.log("Background image loaded.");
      const containerWidth = document.documentElement.clientWidth; // or a specific container's width
      const containerHeight = document.documentElement.clientHeight; // or a specific container's height, adjusting for any UI elements like headers or footers

      // Calculate scale to fit the image within the container while maintaining aspect ratio
      const scale = Math.min(
        containerWidth / image.naturalWidth,
        containerHeight / image.naturalHeight
      );

      const canvasWidth = scale * image.naturalWidth;
      const canvasHeight = scale * image.naturalHeight;

      // Set canvas size
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Draw scaled image
      ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    };

    if (imageData && imageData.segmentation) {
      preparedSegmentationsRef.current = parseSegmentationData(
        imageData.segmentation
      );
    }
  }, [imageData]);

  // For calculating the bounding boxes
  useEffect(() => {
    const canvas = canvasRef.current;
    // const ctx = canvas.getContext("2d");

    if (!canvas) return;

    // Draw bounding boxes
    drawSegmentations(selectedSegmentIds, hoveredSegmentId);
  }, [selectedSegmentIds, hoveredSegmentId]);

  // For creating the event handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas) return;

    // Function to handle click events on the canvas
    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const clickX =
        (event.clientX - rect.left) * (image.naturalWidth / canvas.width);
      const clickY =
        (event.clientY - rect.top) * (image.naturalHeight / canvas.height);

      preparedSegmentationsRef.current.forEach((segment) => {
        // Scale the segmentation dimensions back to the original image size for accurate comparison
        const scaledX = segment.x * image.naturalWidth;
        const scaledY = segment.y * image.naturalHeight;
        const scaledWidth = segment.width * image.naturalWidth;
        const scaledHeight = segment.height * image.naturalHeight;

        // Check if the click is within a bounding box
        if (
          clickX >= scaledX &&
          clickX <= scaledX + scaledWidth &&
          clickY >= scaledY &&
          clickY <= scaledY + scaledHeight
        ) {
          // setSelectedSegmentIds(id); // Set the clicked segment ID
          const isSelected = selectedSegmentIds.includes(segment.id);
          if (isSelected) {
            // If already selected, remove it from the selection
            setSelectedSegmentIds(
              selectedSegmentIds.filter(
                (selectedId) => selectedId !== segment.id
              )
            );
            setSegmentThumbnails(
              segmentThumbnails.filter(
                (thumbnail) => thumbnail.id !== segment.id
              )
            );
          } else {
            // Otherwise, add it to the selection
            const thumbnailUrl = captureThumbnail(segment);
            // console.log("Segment.classType", segment.classType);
            setSelectedSegmentIds([...selectedSegmentIds, segment.id]);
            setSegmentThumbnails((segmentThumbnails) => [
              {
                id: segment.id,
                classType: segment.classType,
                thumbnailUrl: thumbnailUrl,
              },
              ...segmentThumbnails, // Spread the previous items after the new item
            ]);
          }
        }
      });
    };

    // Function to handle hover events on canvas
    const handleMouseMove = throttle((event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX =
        (event.clientX - rect.left) * (image.naturalWidth / canvas.width);
      const mouseY =
        (event.clientY - rect.top) * (image.naturalHeight / canvas.height);

      let isHovering = false;

      preparedSegmentationsRef.current.forEach(
        ({ id, x, y, width, height }) => {
          const scaledX = x * image.naturalWidth;
          const scaledY = y * image.naturalHeight;
          const scaledWidth = width * image.naturalWidth;
          const scaledHeight = height * image.naturalHeight;

          if (
            mouseX >= scaledX &&
            mouseX <= scaledX + scaledWidth &&
            mouseY >= scaledY &&
            mouseY <= scaledY + scaledHeight
          ) {
            isHovering = true;
            if (hoveredSegmentId !== id) {
              setHoveredSegmentId(id); // Update the hovered segment ID
            }
          }
        }
      );
      if (!isHovering && hoveredSegmentId !== null) {
        setHoveredSegmentId(null); // Clear hover state if not hovering over any segment
      }
    }, 100);

    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousemove", handleMouseMove);

    // Cleanup function to remove event listeners
    return () => {
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [selectedSegmentIds, hoveredSegmentId, segmentThumbnails]);
  // #endregion

  return (
    <div className="canvas-container">
      <ExitButton to={backPath} />
      <canvas ref={canvasRef}></canvas>
      <SelectionPanel segmentThumbnails={segmentThumbnails} imageId={imageId} />
    </div>
  );
};

export default ImageViewer;
