import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="company-information">
                <p>Web Application Development</p>
                <p>School of Computer Science</p>
                <p>Cartoontopia Web Application</p>
            </div>
            <div className="footer-content">
                © {year} Jianbin. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;