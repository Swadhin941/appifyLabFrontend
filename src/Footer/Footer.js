import React from 'react';
import "./Footer.css";
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className='container-fluid bg-dark footerContainer'>
            <div>
            <Link to={'/'} className='footerLogo'>RO</Link>
            <div>
                <p className='text-white text-center'> <small>Reach Out</small></p>
            </div>
            </div>
        </div>
    );
};

export default Footer;