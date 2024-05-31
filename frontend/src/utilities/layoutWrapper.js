import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/headerComponent";
import Footer from "../components/footerComponent";

const LayoutProvider = ({ children }) => {
  const location = useLocation();
  const hideLayout =
    (location.pathname.includes("/images/") &&
      location.pathname.includes("/edit")) ||
    location.pathname.includes("/operator");

  return (
    <div className="d-flex flex-column min-vh-100">
      {!hideLayout && <Header />}
      <main className="flex-grow-1">{children}</main>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default LayoutProvider;
