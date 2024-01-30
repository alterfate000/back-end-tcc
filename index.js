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


app.use(
  session({
    key: "ad_id",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);



//var admin_user_edit=""

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "tcc",
})


var user_detail = "";
var user_detail_admin = ""
var loggedIn_server = false ;
var loggedIn_server_admin = false ;



//login 




app.get("/login_user", (req, res) => {
  //req.session.user = test;
  console.log("loggedIn_server");
  console.log(loggedIn_server);
  //req.session.save()
  if (req.session.user && loggedIn_server == true) {
    console.log("if");
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    if(loggedIn_server == true){
      console.log("esle if");
      req.session.user = user_detail;
      res.send({ loggedIn: true, user: req.session.user });
    }else{
      console.log("esle else");
      loggedIn_server = false;
      res.send({ loggedIn: false });
    }
    //console.log("else");
    //res.send({ loggedIn: false });
  }
});


app.post('/login', (req, res) => {
  const ad_username = req.body.ad_username;
  const ad_pass = req.body.ad_pass;

  db.query(
    "SELECT * FROM admin WHERE ad_username = ?",
    ad_username,
    (err, result) => {
      if (err) {
        loggedIn_server = false;
        res.send({ err: err });
      }
      
      if (result.length > 0) {
        // bcrypt.compare(res_pass, result[0].res_pass, (error, response) => {
          if (result[0].ad_pass == ad_pass) {
            req.session.user = result;
            user_detail = result ;
            loggedIn_server = true;
            //console.log("login");
            //console.log(test.loggedIn);
            //console.log(req.session.user);
            //console.log(user_detail[0].res_id);
            res.send(result);
          } else {
            loggedIn_server = false;
            res.send({ message: "password ไม่ถูกต้อง!" });
          }
        // });
      }else {
        loggedIn_server = false;
        res.send({ message: "ไม่พบ username นี้ในระบบ" });
      }
    }
  );
});









app.get('/admin_list',(req,res)=>{
  db.query("SELECT * FROM admin", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});





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


app.get("/edit_admin/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM admin WHERE ad_username = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
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

app.get("/edit_car/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM car WHERE id_car = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


app.put("/update_admin", (req, res) => { 
  const ad_pass = req.body.ad_pass; 
  const ad_license = req.body.ad_license;
 
  const ad_username = req.body.ad_username;
  
  db.query(
    "UPDATE admin SET ad_pass = ?,ad_license = ? WHERE ad_username  = ?",
    [ad_pass, ad_license, ad_username ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});







app.put("/update_emp", (req, res) => { 
  const first_name = req.body.first_name; 
  const last_name = req.body.last_name;
  const department = req.body.department;
  const id_employee = req.body.id_employee;
  
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

app.put("/update_car", (req, res) => { 
  const id_car = req.body.id_car;
  const catagory = req.body.catagory; 
  const number_car = req.body.number_car;
  const province = req.body.province;
  const brand = req.body.brand;
  const model = req.body.model;
  const year_car = req.body.year_car;
  const vin = req.body.vin;
  
  db.query(
    "UPDATE car SET catagory = ?,number_car = ?,province = ?,brand = ?,model = ?,year_car = ?,vin = ? WHERE id_car = ?",
    [catagory, number_car, province, brand, model, year_car, vin, id_car],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});


app.post('/add_admin', (req, res) => {
  const ad_username = req.body.ad_username;
  const ad_pass = req.body.ad_pass;
  const ad_license = req.body.ad_license;
 
  db.query(
    "INSERT INTO admin (ad_license, ad_pass , ad_username) VALUES (?,?,?)",
    [ad_license, ad_pass, ad_username],
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

app.post('/add_car', (req, res) => {
  const id_car = req.body.id_car;
  const catagory = req.body.catagory; 
  const number_car = req.body.number_car;
  const province = req.body.province;
  const brand = req.body.brand;
  const model = req.body.model;
  const year_car = req.body.year_car;
  const vin = req.body.vin;
 
  db.query(
    "INSERT INTO car (catagory, number_car , province, brand, model, year_car, vin ) VALUES (?,?,?,?,?,?,?)",
    [catagory, number_car , province, brand, model, year_car, vin],
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

app.get('/admin_history',(req,res)=>{
  db.query("SELECT * FROM admin", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
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

app.get('/car_history',(req,res)=>{
  db.query("SELECT * FROM car", (err,result)=>{
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

app.delete("/delete_car/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM car WHERE id_car = ?", id, (err, result) => {
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
