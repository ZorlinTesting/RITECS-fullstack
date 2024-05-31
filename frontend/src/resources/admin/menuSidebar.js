// src/MyMenu.js
import * as React from 'react';
import { DashboardMenuItem, MenuItemLink } from 'react-admin';
// import BookIcon from '@material-ui/icons/Book'; // Use appropriate icons
// import PeopleIcon from '@material-ui/icons/People';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faImage, faEdit , faTachometerAlt } from '@fortawesome/free-solid-svg-icons';


const MenuSidebar = ({ onMenuClick, logout }) => (
    <div>
        {/* Custom Dashboard link */}
        <DashboardMenuItem to='/admin' onClick={onMenuClick} icon={<FontAwesomeIcon icon={faUser} />} />
        <MenuItemLink to="/admin/users" primaryText="Users" leftIcon={<FontAwesomeIcon icon={faUser} />} onClick={onMenuClick} />
        <MenuItemLink to="/admin/images" primaryText="Images" leftIcon={<FontAwesomeIcon icon={faImage} />} onClick={onMenuClick} />
        <MenuItemLink to="/admin/corrections" primaryText="Corrections" leftIcon={<FontAwesomeIcon icon={faEdit} />} onClick={onMenuClick} />
        <MenuItemLink to="/admin/metrics" primaryText="Metrics" leftIcon={<FontAwesomeIcon icon={faTachometerAlt} />} onClick={onMenuClick} />
        {/* Include other links as needed */}
        {logout}
    </div>
);

export default MenuSidebar;
