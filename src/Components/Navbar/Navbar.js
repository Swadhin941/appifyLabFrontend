import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import "./Navbar.css";
import { SharedData } from '../SharedData/SharedContext';

const Navbar = () => {
    const { user, logout } = useContext(SharedData);
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary ">
            <div className="container-fluid">
                <Link to={'/'} className='navbar-brand navbar-logo'>RO</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse navbarItem" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" to={'/'} ><i className='bi bi-house-door-fill fs-3'></i></NavLink>
                        </li>
                        <li className='nav-item'>
                            {
                                user && user?.uid ? <p style={{ cursor: "pointer" }} onClick={() => logout()}>Logout</p> : <NavLink to={'/login'} className='nav-link'><i className='bi bi-person-circle fs-3'></i></NavLink>
                            }

                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;