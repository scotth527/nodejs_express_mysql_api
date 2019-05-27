const mysql = require('mysql');
const express = require('express');
var app = express();
const {user_name, password, database} = require('../../config')
const bodyparser = require('body-parser');

app.use(bodyparser.json())

var mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: user_name,
  password:password,
  database:database
})

mysqlConnection.connect((err)=> {
  if (!err) {
    console.log('DB connection succeded.');
  } else {
    console.log('DB connection failed.' + JSON.stringify(err, undefined,2))
  }
});

app.get('/employees/:id',(req,res)=> {
  mysqlConnection.query('SELECT * FROM employee WHERE EmpID = ?', [req.params.id],(err,rows,fields)=> {
    if(!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  })
})

app.listen(3000,()=>console.log('Express server is running at port 3000'));
