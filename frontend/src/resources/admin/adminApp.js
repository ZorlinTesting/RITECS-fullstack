import { Admin, Resource } from "react-admin";
import dataProvider from "../../utilities/dataProvider";
import AdminDashboard from "./adminDashboard";
import { ImageList, ImageShow } from "../imageResource";
import { CorrectionList, CorrectionShow } from "../correctionResource";
import { UserList, UserShow } from "../userResource";
import { MetricList, MetricShow } from "../metricResource";
import AdminLayout from "./adminLayout"

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

const AdminApp = () => (
    <Admin dashboard={AdminDashboard} dataProvider={dataProvider(apiUrl)} layout={AdminLayout}>
        <Resource name="images" list={ImageList} show={ImageShow} />
        <Resource name="corrections" list={CorrectionList} show={CorrectionShow} />
        <Resource name="users" list={UserList} show={UserShow} />
        <Resource name="metrics" list={MetricList} show={MetricShow} />
        {/* other resources */}
    </Admin>
);

export default AdminApp;