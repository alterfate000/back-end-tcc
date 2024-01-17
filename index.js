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









app.listen('3001', () => {
  console.log('Server is running on port 3001');
})


