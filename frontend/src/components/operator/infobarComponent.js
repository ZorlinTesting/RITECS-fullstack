import React, { useState, useEffect, useMemo } from "react";
import { Container, Navbar, Nav, Image } from "react-bootstrap";
import DetailDrawer from "./operatorDrawer";

const InfoBar = ({ username, date, thumbnailCount, targetThumbnail }) => {
  return (
    <Container>
      <Navbar bg="light" variant="light" className="shadow-sm">
        <Container>
          <Nav className="align-items-center w-100">
            <Nav.Item className="flex-grow-1 align-items-center">
              <strong>Count:</strong> {thumbnailCount}
            </Nav.Item>
            <Nav.Item className="flex-grow-1 mx-2">
              <strong>Target:</strong>
              <Image
                src={targetThumbnail.src}
                style={{ width: "50px", height: "50px" }}
              />
            </Nav.Item>
            {/* {targetThumbnail && targetThumbnail.length > 0 && (
              <Nav.Item className="flex-grow-1 mx-2">
                <strong>Targets:</strong>
                {targetThumbnail.map((thumbnail, index) => (
                  <Image
                    key={index}
                    src={thumbnail.src}
                    alt={`Thumbnail ${thumbnail.id}`}
                    className="thumbnail-img-infobar"
                  />
                ))}
              </Nav.Item>
            )} */}
            <DetailDrawer
              date={date}
              username={username}
              thumbnailCount={thumbnailCount}
            />
          </Nav>
        </Container>
      </Navbar>
    </Container>
  );
};

export default InfoBar;
