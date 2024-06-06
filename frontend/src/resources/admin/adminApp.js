import React, { useState, useEffect } from 'react';
import { Admin, Resource } from "react-admin";
import dataProvider from "../../utilities/dataProvider";
import AdminDashboard from "./adminDashboard";
import { ImageList, ImageShow } from "../imageResource";
import { CorrectionList, CorrectionShow } from "../correctionResource";
import { UserList, UserShow } from "../userResource";
import { MetricList, MetricShow } from "../metricResource";
import AdminLayout from "./adminLayout"

import { useLocation } from 'react-router-dom';
import LoginModal from "../../components/loginModal";
import { Container, Alert } from 'react-bootstrap';


// const apiUrl = "http://127.0.0.1:8000/api";
// const apiBaseURL = `http://${window.location.hostname}/api`;

// const apiUrl = `http://localhost/api`;

// Dynamically set the base URL based on the current location
const { protocol, hostname } = window.location;
let apiBaseURL;

if (hostname === 'localhost' || hostname === '127.0.0.1') {
  apiBaseURL = `${protocol}//localhost/api`;
} else {
  apiBaseURL = `${protocol}//${hostname}/api`;
}

const apiUrl = apiBaseURL;

// const AdminApp = () => (
//     <Admin dashboard={AdminDashboard} dataProvider={dataProvider(apiUrl)} layout={AdminLayout}>
//         <Resource name="images" list={ImageList} show={ImageShow} />
//         <Resource name="corrections" list={CorrectionList} show={CorrectionShow} />
//         <Resource name="users" list={UserList} show={UserShow} />
//         <Resource name="metrics" list={MetricList} show={MetricShow} />
//         {/* other resources */}
//     </Admin>
// );

const AdminApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Logic to check if the user is already logged in (e.g., check localStorage)
    const username = localStorage.getItem('username');
    const isStaff = localStorage.getItem('is_staff') === 'true';
    if (username) {
      setIsLoggedIn(true);
      setIsStaff(isStaff);
      console.log('USER LOGGED IN!', username, isStaff);
    }
    else {
      setIsLoggedIn(false);
      console.log('USER NOT LOGGED IN!', username, isStaff);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsStaff(localStorage.getItem('is_staff') === 'true');
  };

  return (
    <Container>
      {!isLoggedIn && <LoginModal show={!isLoggedIn} onLogin={handleLogin} />}
      {isLoggedIn && isStaff && (
        <Admin dashboard={AdminDashboard} dataProvider={dataProvider(apiUrl)} layout={AdminLayout}>
          <Resource name="images" list={ImageList} show={ImageShow} />
          <Resource name="corrections" list={CorrectionList} show={CorrectionShow} />
          <Resource name="users" list={UserList} show={UserShow} />
          <Resource name="metrics" list={MetricList} show={MetricShow} />
          {/* other resources */}
        </Admin>
      )}
      {isLoggedIn && !isStaff && (
        <Alert variant="danger" className="mt-5">
          Access Denied: Admins only
        </Alert>
      )}
    </Container>
  );
};

export default AdminApp;