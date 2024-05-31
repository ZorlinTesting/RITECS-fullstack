// src/MyLayout.js
import * as React from 'react';
import { Layout } from 'react-admin';
// import MyAppBar from './MyAppBar';
import MenuSidebar from './menuSidebar';
// import MyNotification from './MyNotification';

// const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} menu={MyMenu} notification={MyNotification} />;
const AdminLayout = (props) => <Layout {...props} menu={MenuSidebar}  />;

export default AdminLayout;
