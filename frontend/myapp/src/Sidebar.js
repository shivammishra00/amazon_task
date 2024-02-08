import React from 'react'
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './task.css';

function Sidebar() {
    return (
        <div className="sidebar-container">
            <Container className="sidebar" >
                <ul className="sidebar-list">
                    <li>
                        <Link to="/category" style={{ color: "white", textDecoration: "none" }}><b>Product category</b></Link>
                    </li>
                    <li>
                        <Link to="/product" style={{ color: "white", textDecoration: "none" }}><b>Product</b> </Link>
                    </li>
                </ul>
            </Container>
        </div>
    )
}

export default Sidebar


