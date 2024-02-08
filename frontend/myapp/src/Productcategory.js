import React, { useState, useEffect } from 'react';
import './task.css';
import { Card, Table, Button, Form, CardBody, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';

function Productcategory() {
    const [data, setData] = useState([]);   /// getapi  ka  use state  hai..
    const [cid, setCid] = useState("");
    const [cname, setCname] = useState("");
    const [show, setShow] = useState(false);   ///  modal ka use state hai ..

    /////////////   update  /////////////////
    const [newCid, setnewCid] = useState("");
    const [newCname, setnewCname] = useState("");


    const handleClose = () => setShow(false);   //arraow function hai jisme state vala function
    const handleShow = () => setShow(true);     // call kiya taki state ki value update ho sake


    async function getData() {
        let apiurl = "http://localhost:5001/displayCategory";
        const data = await fetch(apiurl)
        const result = await data.json()
        // console.log(result)
        setData(result)
    }
    useEffect(() => {
        getData()        ///  unvanted rendring rokne ke liye function yaha call kiya
    }, [])

    async function saveData() {
        const apiUrl = "http://localhost:5001/postCategory";
        console.log(cid, cname)
        const userData = {
            cid: cid,
            cname: cname
        }
        const option = {
            method: "POST",
            body: JSON.stringify(userData),
            headers: {
                "Accept": 'application/json',
                "Content-Type": 'application/json'
            }
        }
        const responce = await fetch(apiUrl, option)
        const res = await responce.json();
        console.log(res);
        if (res.affectedRows > 0) {
            // alert("Record Inserted Successfully");
            Swal.fire(`${res.affectedRows} Record Inserted Successfully`);   ///swet alert
            // alert(`${res.affectedRows} Record Inserted`)
            getData();

        }
        else {
            alert("Server busy\ntry again!!!")
        }
    }

    async function deleteData(cid) {
        console.log(cid)
        const option = {
            method: "DELETE"
        }
        const apiUrl = `http://localhost:5001/deleteCategory?cid=${cid}`;
        const data = await fetch(apiUrl, option)
        const result = await data.json()
        console.log(result);
        if (result.affectedRows > 0) {
            Swal.fire(`${result.affectedRows} Record Deleted Successfully`);
            getData()
        }
        else {
            alert("Server busy\nTry again!!!")
        }
    }

    async function finallyupdate(newCid) {
        console.log(newCid, newCname);
        const apiUrl = `http://localhost:5001/updatecategory?cid=${newCid}`;
        const userData = {
            cname: newCname
        };
        const options = {
            method: "PUT",
            body: JSON.stringify(userData),
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json"
            }
        };
        const responce = await fetch(apiUrl, options);
        const result = await responce.json();
        console.log(result);  /// console me dikhega affected rows 1,
        handleClose(); // save button me click karte hi modal close ho jayega.
        getData();    //alert ok karte hi data update & display in dom . 
        if (result.affectedRows < 1)
            alert(`${newCid} Records does not exit`)
        else
            Swal.fire(` Record Updatedted Successfully`);

    }

    function updateData(cid, cname) {
        console.log(cid, cname)
        setnewCid(cid)
        setnewCname(cname)
        handleShow()     // modal show ke liye function ...
    }


    return (
        <div>
            <div className='category-container '>
                <div className='categoryForm'>
                    <Card style={{ backgroundColor: "#00ecff" }}>
                        <CardBody>
                            <h3>Add Category</h3> <br />
                            <Form>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Category Id</Form.Label>
                                    <Form.Control value={cid} onChange={(e) => setCid(e.target.value)} type="text" placeholder="Enter your cid" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Category Name</Form.Label>
                                    <Form.Control value={cname} onChange={(e) => setCname(e.target.value)} type="email" placeholder="Enter your cname" />
                                </Form.Group>
                                <br />
                                <Button onClick={() => saveData()} variant="primary">Save</Button>{' '}
                            </Form>
                        </CardBody>
                    </Card>
                </div>

                <div className='categoryTable' style={{ width: "420px" }}>
                    <h4>Category List</h4>
                    <Table striped bordered hover variant="light">
                        <thead>
                            <tr style={{ textAlign: "center" }}>
                                <th >CID</th>
                                <th>CNAME</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        {
                            data.map((d, ind) => {
                                return (
                                    <tbody>
                                        <tr>
                                            <td>{d.cid}</td>
                                            <td>{d.cname}</td>
                                            <td><Button variant='danger' onClick={() => deleteData(d.cid)} >Delete</Button>
                                                <Button variant='success' onClick={() => updateData(d.cid, d.cname)} >UPDATE</Button></td>
                                        </tr>
                                    </tbody>
                                )
                                //   console.log(d.cid, d.cname)
                            })
                        }
                    </Table>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control value={newCname} onChange={(e) => setnewCname(e.target.value)} type="text" placeholder="Enter your cname" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => finallyupdate(newCid)}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Productcategory
