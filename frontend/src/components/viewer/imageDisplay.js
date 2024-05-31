import React, { useState, useContext, useEffect } from "react";
import { Card, Pagination, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useImage } from "../../utilities/imageContext";
import useFetchImageData from "../../hooks/useFetchImageData";

import { useTranslation } from "react-i18next";
import "../../utilities/i18n";
  

const ImageDisplay = () => {
  const { t, i18n } = useTranslation();
  // #region No-conditional, adheres to principle of separation of concerns
  const { images, setImages, loading: contextLoading, error: contextError, } = useImage();
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: fetchedImages,
    loading: fetchLoading,
    error: fetchError,
  } = useFetchImageData();

  // Check and print imageData
  useEffect(() => {
    if (images) {
      console.log("imageData received by ImageViewer:", images);
    } else {
      console.log("No imageData received by ImageViewer");
    }
  }, [images]); // Depend on imageData to rerun this effect if it changes

  useEffect(() => {
    // If there's no images in the context, and fetching has completed without errors
    if (
      !contextLoading &&
      !contextError &&
      images.length === 0 &&
      fetchedImages &&
      !fetchError
    ) {
      setImages(fetchedImages);
    }
  }, [
    images,
    fetchedImages,
    contextLoading,
    contextError,
    fetchLoading,
    fetchError,
    setImages,
  ]);

  if (contextLoading || fetchLoading) return <p>Loading...</p>;
  if (contextError || fetchError) return <p>Error loading image data!</p>;
  // #endregion

  // #region Conditional api-call, violates principle of separation of concerns
  // const {
  //   images,
  //   setImages,
  //   loading: contextLoading,
  //   error: contextError,
  // } = useContext(ImagesContext);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  // const fetchImageData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_BASE_URL}/api/images/`,
  //       {
  //         headers: {
  //           Authorization: `Api-Key ${process.env.REACT_APP_API_KEY}`,
  //         },
  //       }
  //     );
  //     setImages(response.data);
  //     setLoading(false);
  //   } catch (error) {
  //     setError(error);
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   // If there are no images in the context and the context is not currently loading or in error state
  //   if (!contextLoading && !contextError && images.length === 0) {
  //     fetchImageData();
  //   }
  // }, [contextLoading, contextError, images, setImages]);

  // // Conditional rendering based on loading and error states
  // if (loading) return <div>Loading images...</div>;
  // if (error) return <div>Error fetching images: {error.message}</div>;

  // #endregion

  const itemsPerPage = 10; // Define how many items you want per page
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = images.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(images.length / itemsPerPage);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container className="mt-5">
      <Row xs={1} sm={2} md={2} lg={3} xl={3} className="g-4">
        {currentItems.map((item) => (
          <Col key={item.id} className="mb-4">
            <Card className="h-100 d-flex flex-md-row flex-sm-column flex-column">
              <Card.Img
                style={{ width: "100%", maxWidth: "180px", objectFit: "cover" }} // Use maxWidth for medium screens
                src={item.image_url}
                alt={item.description || "Fetched from API"}
              />
              <Card.Body>
                {/* In your ImageDisplay component, link to the detail view */}
                {t('file_name')}: <br></br><Card.Title as={Link} to={`/images/${item.id}`}>
                <strong>{item.title}</strong>
                </Card.Title>
                
                <Card.Text><br></br>{t('file_description')}: <br></br>{item.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="d-flex justify-content-center">
        <Pagination>
          {[...Array(totalPages).keys()].map((number) => (
            <Pagination.Item
              key={number + 1}
              active={number + 1 === currentPage}
              onClick={() => handlePageClick(number + 1)}
            >
              {number + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </Container>
  );
};

export default ImageDisplay;
