import { React, useEffect, useState } from 'react';
import { Card, Table, Form, Button, Modal, Pagination } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './task.css';

function Product() {
  const [store, setstore] = useState([]);

  //////   for data post    ///////
  const [cid, setCid] = useState("");
  const [pid, setPid] = useState("");
  const [pname, setPname] = useState("");
  const [pprice, setPprice] = useState();
  const [pimage, setPimage] = useState("");

  /////////////////  for data update  //////////////////////////
  const [show, setShow] = useState(false);
  const [newPid, setnewPid] = useState("");
  const [newPrice, setnewPrice] = useState();
  const [newImage, setnewImage] = useState("");

  const [search, Setsearch] = useState("");    ////  for  search  

  /////    for  pagination    /////   
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function getData() {
    const apiUrl = "http://localhost:5001/displayProduct";
    const data = await fetch(apiUrl)
    const result = await data.json()
    // console.log(result)
    setstore(result)
  }
  useEffect(() => {
    getData()
  }, [])

  async function saveData() {
    console.log(cid, pid, pname, pprice, pimage)
    const apiUrl = "http://localhost:5001/postProduct";
    const formData = new FormData();   ///constructor  

    ////  append your other fields
    formData.append("cid", cid);
    formData.append("pid", pid);
    formData.append("pname", pname);
    formData.append("pprice", pprice);
    formData.append("image", pimage);   ///  append the image file

    const option = {
      method: "POST",
      body: formData
    }
    const responce = await fetch(apiUrl, option)
    const res = await responce.json();
    console.log(res)
    if (res.affectedRows > 0) {
      // alert("Record Inserted seccessfully")
      Swal.fire(`${res.affectedRows} Record Inserted Successfully`);
      getData();
    }
    else {
      alert("Server busy\nTry again!!!");
    }
  };
  async function deleteData(pid) {
    const apiUrl = `http://localhost:5001/deleteProduct?pid=${pid}`;
    const option = {
      method: "DELETE"
    }
    const responce = await fetch(apiUrl, option);
    const result = await responce.json();
    console.log(result)
    if (result.affectedRows > 0) {
      Swal.fire(`${result.affectedRows} Record Deleted Successfully`);
      getData()
    }
    else {
      alert("Server Busy\nTry again!!!");
    }
  }

  async function finnalyUpdate(newPid) {
    console.log(newPid, newPrice, newImage)
    const apiUrl = `http://localhost:5001/updateProduct/patch?pid=${newPid}`;
    const formData = new FormData();
    formData.append("pprice", newPrice);
    formData.append("image", newImage);
    const option = {
      method: "PATCH",
      body: formData
    }
    const responce = await fetch(apiUrl, option)
    const result = await responce.json();
    console.log(result)
    handleClose()
    getData()
  }

  function updateData(pid, pprice, pimage) {
    console.log(pid, pprice, pimage)
    setnewPid(pid);
    setnewPrice(pprice);
    setnewImage(pimage)
    handleShow()
  }


  // async function searchHandle(e) {
  //   let key = e.target.value;
  //   let apiUrl = `http://localhost:5001/displayProduct/cid?cid=${key}`
  //   if (key) {
  //     let result = await fetch(apiUrl)
  //     let res = await result.json()
  //     if (res) {
  //       setstore(res)
  //     }
  //   }
  //   else {
  //     getData()
  //   }
  // }

  return (
    <div>
      <div className='product-container'>
        <div className='productForm'>
          <Card style={{ height: "520px", backgroundColor: "#00ecff" }}>
            <Card.Body>
              <h4>Add Product</h4>
              <Form>
                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                  <Form.Label>Category Cid</Form.Label>
                  <Form.Control value={cid} onChange={(e) => setCid(e.target.value)} type="text" placeholder="Enter your cid" />
                </Form.Group>
                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                  <Form.Label>Product Id</Form.Label>
                  <Form.Control value={pid} onChange={(e) => setPid(e.target.value)} type="text" placeholder="Enter your pid" />
                </Form.Group>
                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control value={pname} onChange={(e) => setPname(e.target.value)} type="text" placeholder="Enter your pname" />
                </Form.Group>
                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                  <Form.Label>Product Price</Form.Label>
                  <Form.Control value={pprice} onChange={(e) => setPprice(e.target.value)} type="number" placeholder="Enter your pprice" />
                </Form.Group>
                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                  <Form.Label>Product Image</Form.Label>
                  <Form.Control onChange={(e) => setPimage(e.target.files[0])} type="file" />
                </Form.Group>
                <br />
                <Button onClick={() => saveData()} variant="primary">Save</Button>{' '}
              </Form>
            </Card.Body>
          </Card>
        </div>

        <div className='producttable'>
          <h4>Product List</h4>
          <Form.Control onChange={(e) => Setsearch(e.target.value)} type="text" placeholder="search product by cid" />
          <Table striped bordered hover variant="light">
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th>CID</th>
                <th>PID</th>
                <th>PNAME</th>
                <th>PPRICE</th>
                <th>PIMAGE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            {
              store.filter((item) => {
                return search.toLowerCase() === '' ? item : item.cid.toString().toLowerCase().includes(search) || item.pname.includes(search)
              })
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((d, index) => {
                  return (
                    <tbody>
                      <tr>
                        <td>{d.cid}</td>
                        <td>{d.pid}</td>
                        <td>{d.pname}</td>
                        <td>{d.pprice}</td>
                        <td><img src={d.pimage} alt='product img' height={50} width={50}></img></td>
                        <td><Button variant='danger' onClick={() => deleteData(d.pid)} >Delete</Button> <Button variant='success' onClick={() => updateData(d.pid, d.pprice, d.pimage)} >UPDATE</Button></td>
                      </tr>
                    </tbody>
                  )
                })
            }
          </Table>
          <Pagination className="justify-content-center">
            {Array.from({ length: Math.ceil(store.length / itemsPerPage) }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Product Price</Form.Label>
            <Form.Control type="number" value={newPrice} onChange={(e) => setnewPrice(e.target.value)} placeholder="Enter your pprice" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Product Image</Form.Label>
            <Form.Control type="file" onChange={(e) => setnewImage(e.target.files[0])} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => finnalyUpdate(newPid)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Product
