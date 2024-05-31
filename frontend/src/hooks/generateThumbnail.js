/**
 * Generates a thumbnail from an image URL based on the specified segment data.
 * @param {string} imageUrl - The source URL of the image.
 * @param {object} segment - The segmentation data for the thumbnail.
 * @returns {Promise<string>} - A promise that resolves with the Data URL of the thumbnail.
 */
export function generateThumbnail(imageUrl, segment) {
  return new Promise((resolve, reject) => {
    // console.log("Processing segment:", segment);

    const image = new Image();
    image.setAttribute("crossOrigin", "anonymous"); // This is needed if the image is served from a different domain
    image.src = imageUrl;

    image.onload = () => {
    //   console.log(
    //     `Image loaded with dimensions width: ${image.naturalWidth}, height: ${image.naturalHeight}`
    //   );

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Failed to create canvas context");
        return;
      }

      // Set canvas size to the size of the segment
      canvas.width = segment.width * image.naturalWidth;
      canvas.height = segment.height * image.naturalHeight;
    //   console.log(
    //     `Canvas dimensions set to width: ${canvas.width}, height: ${canvas.height}`
    //   );

      // Draw the segment of the image on the canvas
      ctx.drawImage(
        image,
        segment.x * image.naturalWidth, // source x
        segment.y * image.naturalHeight, // source y
        canvas.width, // source width
        canvas.height, // source height
        0, // destination x
        0, // destination y
        canvas.width, // destination width
        canvas.height // destination height
      );

      // Convert the canvas to a data URL and resolve it
      const dataUrl = canvas.toDataURL();
    //   console.log(`Data URL generated (truncated): ${dataUrl.substr(0, 50)}`);

      resolve(dataUrl);
    };

    image.onerror = () => {
      reject(new Error("Failed to load image at " + imageUrl));
    };
  });
}
