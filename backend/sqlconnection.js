import mysql from 'mysql';

let connection = mysql.createConnection({
 host:'localhost',
 user:'root',
 password:'',
 port:3306,
 database:'amazon'
})
connection.connect((err)=>{
 if(err){
  console.log(err)
 }
 else{
  console.log('Connected.....')
 }
})
export default connection;