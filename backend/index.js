import express from 'express';
import connection from './sqlconnection.js';
import Joi from 'joi';
import cors from 'cors';

import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

const app = express();
app.use(express.json());
app.use(cors());

///////   use multer s3   /////
const bucketName = "shivam234";     /// name of the bucket is forimg12345

/// store file in aws s3 configuration 
const s3 = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: "AKIAWANA4P37BWOXBRF5",
        secretAccessKey: "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"
    }
})

// Storage configuration 
let Storage = multerS3({
    s3: s3,
    bucket: bucketName,
    acl: 'public-read',
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname })
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
let upload = multer({ storage: Storage })


app.get('/displayCategory', (req, res) => {
    let sqlQuery = `SELECT * FROM category`;
    connection.query(sqlQuery, (err, result) => {
        if (err) {
            res.send(err.sqlMessage)
        } else {
            res.send(result)
        }
    })
})
app.post('/postCategory', (req, res) => {
    let data = req.body;
    let sqlQuery = "INSERT INTO category SET ?"
    const schema = Joi.object({          ///  schema banaya joi use karne ke liye 
        cid: Joi.string().min(2).max(5).required(),      /// jitni field ho utni de do
        cname: Joi.string().min(3).max(30).required()
    })
    let result = schema.validate(req.body)    /// validate use kiya jo data body se send
    // karege 
    if (result.error) {
        res.status(400).send(result.error.details[0].message)
        return;
    }
    connection.query(sqlQuery, [data], (err, result) => {
        if (err)
            throw err
        else
            res.send(result);
    })
})
app.put('/updatecategory', (req, res) => {
    let { cname } = req.body;
    let cid = req.query.cid;
    let sqlQuery = "UPDATE category SET cname=?  WHERE cid=?"
    const schema = Joi.object({
        cname: Joi.string().min(3).max(30).required()
    })
    let result = schema.validate(req.body)
    if (result.error) {
        res.status(400).send(result.error.details[0].message)
        return;
    }
    connection.query(sqlQuery, [cname, cid], (err, result) => {
        if (err)
            throw err
        else
            res.send({ message: "Data Updated successfully!!!", output: result });
    })
})
app.delete('/deleteCategory', (req, res) => {
    let cid = req.query.cid;
    let sqlQuery = `DELETE FROM category WHERE cid = ?`;
    connection.query(sqlQuery, [cid], (err, result) => {
        if (err) {
            res.send(err.sqlMessage)
        } else {
            res.send(result)
        }
    })
})

app.get('/displayProduct', (req, res) => {
    let sqlQuery = `SELECT * FROM product `;
    connection.query(sqlQuery, (err, result) => {
        if (err) {
            res.send(err.sqlMessage)
        } else {
            res.send(result)
        }
    })
})
app.get('/displayProduct/cid', (req, res) => {
    let cid = req.query.cid;
    let sqlQuery = `SELECT * FROM product WHERE cid=?`;
    connection.query(sqlQuery, [cid], (err, result) => {
        if (err) {
            res.send(err.sqlMessage)
        } else {
            res.send(result)
        }
    })
})
app.post('/postProduct', upload.single('image'), (req, res) => {
    let data = {
        cid: req.body.cid,
        pid: req.body.pid,
        pname: req.body.pname,
        pprice: req.body.pprice,
        pimage: req.file.location

    };

    let sqlQuery = "INSERT INTO product SET ?"

    const schema = Joi.object({          ///  schema banaya joi use karne ke liye 
        cid: Joi.string().min(2).max(5).required(),
        pid: Joi.string().min(2).max(5).required(),      /// jitni field ho utni de do
        pname: Joi.string().min(3).max(30).required(),
        pprice: Joi.number().positive().required(),
        // pimage: Joi.string().min(0).max(500).required()
        // pimage: Joi.string().uri().required()
        // pimage: Joi.string().uri({ scheme: ['http', 'https'] }).required()

    })
    let result = schema.validate(req.body)    /// validate use kiya jo data body se send karege 
    if (result.error) {
        res.status(400).send(result.error.details[0].message)
        return;
    }
    connection.query(sqlQuery, [data], (err, result) => {
        if (err)
            throw err
        else
            res.send(result);
    })
})
app.patch('/updateProduct/patch', upload.single('image'), (req, res) => {
    let pid = req.query.pid;
    let pprice = req.body.pprice;
    let pimage = req.file.location;
    let sqlQuery = "UPDATE product SET pprice=? , pimage=? WHERE pid=?"
    const schema = Joi.object({
        pprice: Joi.number().positive().required(),
        // pimage: Joi.string().min(0).max(500).required()
    })
    let result = schema.validate(req.body)
    if (result.error) {
        res.status(400).send(result.error.details[0].message)
        return;
    }
    connection.query(sqlQuery, [pprice, pimage, pid], (err, result) => {
        if (err)
            throw err
        else
            res.send({ message: "Data Updated successfully!!!", output: result });
    })
})
app.delete('/deleteProduct', (req, res) => {
    let pid = req.query.pid;
    let sqlQuery = `DELETE FROM product WHERE pid = ?`;
    connection.query(sqlQuery, [pid], (err, result) => {
        if (err) {
            res.send(err.sqlMessage)
        } else {
            res.send(result)
        }
    })
})

app.listen(5001, () => {
    console.log(`server is running on port 5001`)
})

