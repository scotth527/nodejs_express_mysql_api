const mysql = require('mysql');
const express = require('express');
var app = express();
const {user_name, password, database} = require('../config')
const bodyparser = require('body-parser');

app.use(bodyparser.json())

var mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: user_name,
  password:password,
  database:database,
  port: 3306,
  multipleStatements:true
})

mysqlConnection.connect((err)=> {
  if (!err) {
    console.log('DB connection succeded.');
  } else {
    console.log('DB connection failed.' + JSON.stringify(err, undefined,2))
  }
});

//Get all employees
app.get('/employees/',(req,res)=> {
  mysqlConnection.query('SELECT * FROM employee;',(err,rows,fields)=> {
    if(!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  })
})

//Get employee by ID
app.get('/employees/:id',(req,res)=> {
  mysqlConnection.query('SELECT * FROM employee WHERE EmpID = ?', [req.params.id],(err,rows,fields)=> {
    if(!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  })
})

app.get('/employees/:role',(req,res)=> {
  mysqlConnection.query('SELECT * FROM employee WHERE role = ?', ['' + req.params.role],(err,rows,fields)=> {
    if(!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  })
})

//Adding a new employee, used a procedure in mysql to check if EmpID is 0 or not, if 0 then add new entry, if not update the particular one.
app.post('/employees/',(req,res)=> {
  let emp = req.body;
  var sql = "SET @EmpID = ?; SET @FirstName = ?; SET @LastName = ?; SET @Age =?; SET @role =?; \
  CALL AddEmployee(@EmpID, @FirstName, @LastName, @Age, @role);";
  mysqlConnection.query(sql, [emp.EmpID, emp.FirstName, emp.LastName, emp.Age, emp.role],(err,rows,fields)=> {
    if(!err) {
     rows.forEach(element=> {
       if(element.constructor == Array) {
         res.send("Inserted new employee " + element[0].EmpID)
       }
     })
    } else {
      console.log(err);
    }
  })
})

//Update entry, similar to post but NEED to include EmpID != 0
app.put('/employees/',(req,res)=> {
  let emp = req.body;
  var sql = "SET @EmpID = ?; SET @FirstName = ?; SET @LastName = ?; SET @Age =?; SET @role =?; \
  CALL AddEmployee(@EmpID, @FirstName, @LastName, @Age, @role);";
  mysqlConnection.query(sql, [emp.EmpID, emp.FirstName, emp.LastName, emp.Age, emp.role],(err,rows,fields)=> {
    if(!err) {
     res.send("Updated successfully")
    } else {
      console.log(err);
    }
  })
})

//Delete request by ID
app.delete('/employees/:id',(req,res)=> {
  mysqlConnection.query('DELETE FROM employee WHERE EmpID = ?', [req.params.id],(err,rows,fields)=> {
    if(!err) {
      res.send("Deleted successfully");
    } else {
      console.log(err);
    }
  })
})


app.listen(3000,()=>console.log('Express server is running at port 3000'));
