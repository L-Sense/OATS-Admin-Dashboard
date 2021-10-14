import React from 'react'
import { Link } from 'react-router-dom';
import './sidebar.css'
import HomeIcon from '@material-ui/icons/Home';
import ListAltIcon from '@material-ui/icons/ListAlt';
import GroupIcon from '@material-ui/icons/Group';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {authenticationService} from '../../services/authenticationService'


export default function Sidebar() {

    const handleLogout = ()=>{
        authenticationService.logout()
    }

    return (
        <div className='sidebar'>
            <div className="sidebarWrapper">
                <div className="sidebarLogoContainer">
                    <div className="sidebarLogo">
                        <h1>O.A.T.S</h1>
                        <h4>Admin Dashboard</h4>
                    </div>
                    <hr/>
                </div>
                <div className="sidebarMenu">
                        <ul className="sidebarList">
                            <Link to={"/"} className="sidebarLink">
                                <li className="sidebarListItem">
                                    <HomeIcon className="sidebarIcon"/>
                                    Overview
                                </li>
                            </Link>
                        </ul>
                    <h3 className="sidebarTitle">View Data</h3>
                    <ul className="sidebarList">
                        <li className="sidebarListItem">
                            <Link to={"/employees"} className="sidebarLink">
                                <GroupIcon className="sidebarIcon"/>
                                Employee Information
                            </Link>
                        </li>
                        <li className="sidebarListItem">
                            <Link to={"/attendance"} className="sidebarLink">
                                <ListAltIcon className="sidebarIcon"/>
                                Attendance Records
                            </Link>
                        </li>
                    </ul>

                    <h3 className="sidebarTitle">Admin Matters</h3>
                    <ul className="sidebarList">
                        <li className="sidebarListItem">
                            <Link to={"/newEmployee"} className="sidebarLink">
                                <ControlPointIcon className="sidebarIcon"/>
                                Create New Employee
                            </Link>
                        </li>
                        <li className="sidebarListItem" onClick={()=>handleLogout()} id="logoutItem">
                            <Link to='/login'> 
                                <ExitToAppIcon className="sidebarIcon"/>
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
