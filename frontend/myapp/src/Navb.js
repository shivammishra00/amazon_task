import React from 'react'
import { Nav } from 'react-bootstrap';
function Navb() {
    return (
        <div>
            <Nav variant="underline" defaultActiveKey="/home" style={{ backgroundColor: "#2f2626", textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                <Nav.Item>
                    <Nav.Link eventKey="disabled" disabled>
                        <b style={{color:"white"}}>Welcom To Home Page</b>
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    )
}

export default Navb
