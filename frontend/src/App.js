// import logo from "./logo.svg";
import "flatpickr/dist/themes/material_green.css";
import "./App.css";
import React, { useEffect } from "react";
//import ItemList from './ItemList';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import IntegratedScreen from "./components/integratedScreen";
import ImageDisplay from "./components/viewer/imageDisplay";
import ImageDetailView from "./components/viewer/imageDetailView";
import ImageViewer from "./components/viewer/imageViewer";
import ImageOperator_ni from "./components/operator/imageOperator";
import RedirectComponent from "./components/redirectScreen";
import ConfirmationComponent from "./components/confirmationScreen";

// Import Bootstrap CSS in the entry file of your React app (e.g., index.js or App.js)
import "bootstrap/dist/css/bootstrap.min.css";

//Setup layout wrapper
import LayoutProvider from "./utilities/layoutWrapper";
//Setup image provider for image caching
import { ImagesProvider } from "./utilities/imageContext";
import { ModalProvider } from "./utilities/modalContext";

import { useTranslation } from "react-i18next";
import "./utilities/i18n";
import OperationSetup from "./components/operator/operationSetup";
import ImageOperator from "./components/operator/imageOperator";

//
// import { Admin, Resource } from "react-admin";
// import drfProvider from "./utilities/drfProvider"; // Assuming this is your customized data provider
// import {
//   UserList,
//   UserEdit,
//   UserCreate,
//   UserShow,
// } from "./resources/userResource"; // Import your resource components
// import { ImageList, ImageShow } from "./resources/imageResource";
// import AdminDashboard from "./resources/admin/adminDashboard";
// import AdminLayout from "./resources/admin/adminLayout";
import AdminApp from "./resources/admin/adminApp";
import AboutScreen from "./components/aboutScreen";

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
  }, [i18n]);

  return (
    // <ImagesProvider>
      <ModalProvider>
        <Router>
          <LayoutProvider>
            <Routes>
              <Route path="/admin/*" element={<AdminApp />} />
              <Route path="/" element={<IntegratedScreen />} />
              <Route path="/about" element={<AboutScreen />} />
              <Route path="/images" element={<ImageDisplay />} />
              <Route path="/images/:imageId" element={<ImageDetailView />} />
              <Route path="/images/:imageId/edit" element={<ImageViewer />} />
              {/* <Route path="/login" element={<LoginComponent />} /> */}
              <Route path="/setup" element={<OperationSetup />} />
              <Route
                path="/operator/:date/:thumbnailId"
                element={<ImageOperator />}
              />
              {/* <Route path="/ai" element={<ImageOperator_ni />} /> */}
              <Route path="/operator" element={<RedirectComponent />} />
              <Route path="/success" element={<ConfirmationComponent />} />
              {/* Additional routes can be defined here */}
            </Routes>
          </LayoutProvider>
        </Router>
      </ModalProvider>
    // </ImagesProvider>
  );
}

export default App;
