const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST","DELETE","PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

//var admin_user_edit=""
var publication_id = "";
const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "tcc",
  
})

app.get('/employee_list',(req,res)=>{
  db.query("SELECT * FROM employee", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/car_list',(req,res)=>{
  db.query("SELECT * FROM car", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});



app.get("/edit_employee/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM employee WHERE id_employee = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


app.put("/update_emp", (req, res) => { 
  const first_name = req.body.first_name; 
  const last_name = req.body.last_name;
  const department = req.body.department;
  const id_employee = req.body.id_employee;
  //const res_id = req.body.res_id;
  db.query(
    "UPDATE employee SET first_name = ?,last_name = ?,department = ? WHERE id_employee = ?",
    [first_name, last_name, department, id_employee],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});


app.post('/add_emp', (req, res) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const department = req.body.department;
 
 

  db.query(
    "INSERT INTO employee (first_name, last_name , department) VALUES (?,?,?)",
    [first_name, last_name, department],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        //console.log("result")
        //console.log(result)

        res.send(result);
      }
    }
  );
});


app.get('/emp_history',(req,res)=>{
  db.query("SELECT * FROM employee", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});


app.delete("/delete_emp/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM employee WHERE id_employee = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("yes");
    }
  });
});









app.listen('3001', () => {
  console.log('Server is running on port 3001');
})


