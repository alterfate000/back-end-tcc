const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");

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
app.use(session({
    secret: 'secret-key', // กำหนดคีย์สำหรับการเข้ารหัสข้อมูล Session
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // เซ็ตเป็น true เมื่อใช้ HTTPS
        maxAge: 1000 * 60 * 60 * 24 // ระยะเวลาที่ Cookie จะหมดอายุ (24 ชั่วโมง)
    }
}));



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

var chk_ad_license = ""


//login 

app.get('/login_def', (req, res) => {
  loggedIn_server = false;
  chk_ad_license = "";
});




app.get("/login_user", (req, res) => {
  //req.session.user = test;
  //console.log("loggedIn_server");
  console.log('chk_ad_license' );
  console.log(chk_ad_license );
  //req.session.save()
  if (chk_ad_license != ""  && loggedIn_server == true) {
    console.log("if");
    res.send({ loggedIn: true, user: chk_ad_license });
  } else {
    if(loggedIn_server == true){
      console.log("esle if");
      
      res.send({ loggedIn: true, user: 'hello11' });
      
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
            loggedIn_server = true;
            //console.log("login");
            //console.log(test.loggedIn);
            //console.log(req.session.user);
            console.log(result[0].ad_license);
            chk_ad_license = result[0].ad_license
            //req.session.user = '00';
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


app.get('/logout', (req, res) => {
  user_detail = "";
  loggedIn_server = false ;
  req.session.user = user_detail;
  req.session.destroy();
  res.send("logout");
});

app.get("/login_admin_check", (req, res) => {
  //req.session.user = test;
  console.log("loggedIn_server");
  console.log(loggedIn_server_admin);
  //req.session.save()
  if (req.session.user && loggedIn_server_admin == true) {
    console.log("if");
    res.send({ loggedIn_admin: true, user: req.session.user });
  } else {
    if(loggedIn_server_admin == true){
      console.log("esle if");
      req.session.user = user_detail;
      res.send({ loggedIn_admin: true, user: req.session.user });
    }else{
      console.log("esle else");
      loggedIn_server_admin = false;
      res.send({ loggedIn_admin: false });
    }
    //console.log("else");
    //res.send({ loggedIn: false });
  }
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
  db.query("SELECT * FROM car " , (err,result)=>{
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





app.get('/test_data',(req,res)=>{
  db.query("SELECT * FROM testdata", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/order_pair_list/:id',(req,res)=>{
  const id = req.params.id;
  db.query("SELECT * FROM order_pair WHERE id_job = ?", id, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/car_detail/:id',(req,res)=>{
  const id = req.params.id;
  db.query("SELECT * FROM `car` WHERE id_car = ?", id, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});


app.post('/add_job_list', (req, res) => {
  const id = req.body.id;
  const pair_detail = req.body.pair_detail; 
  const pair_location = req.body.pair_location;
  const id_job = req.body.id_job;
  
 
  db.query(
    "INSERT INTO order_pair (id, pair_detail , pair_location, id_job) VALUES (?,?,?,?)",
    [id, pair_detail , pair_location, id_job],
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


app.delete("/delete_job_list", (req, res) => {
  const id = req.query.id;
  const id_job = req.query.id_job;
  console.log('id');
  console.log(id);
  console.log('id_job');
  console.log(id_job);
  db.query("DELETE FROM order_pair WHERE id = ?  and id_job = ? ;", [id,id_job], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("yes");
    }
  });
});


app.get('/employee_step1_list',(req,res)=>{
  db.query("SELECT * FROM employee WHERE department = 'เคาะ' ", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/employee_step2_list',(req,res)=>{
  db.query("SELECT * FROM employee WHERE department = 'เตรียมพื้น' ", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/employee_step3_list',(req,res)=>{
  db.query("SELECT * FROM employee WHERE department = 'ผสมสี'  ", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/employee_step4_list',(req,res)=>{
  db.query("SELECT * FROM employee WHERE department = 'พ่นสี' ", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/employee_step5_list',(req,res)=>{
  db.query("SELECT * FROM employee WHERE department = 'ประกอบ' ", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/employee_step6_list',(req,res)=>{
  db.query("SELECT * FROM employee WHERE department = 'ขัดสี' ", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/employee_step7_list',(req,res)=>{
  db.query("SELECT * FROM employee WHERE department = 'ทำความสะอาด' ", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});




app.get('/get_name_emp/:id_employee',(req,res)=>{
  const id_employee = req.params.id_employee;
  db.query("SELECT * FROM employee WHERE id_employee = ?", id_employee, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/get_name_emp/:id_employee',(req,res)=>{
  const id_employee = req.params.id_employee;
  db.query("SELECT * FROM employee WHERE id_employee = ?", id_employee, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.post('/save_job_detail', (req, res) => {
  const pay_status = req.body.pay_status;
  const car_status = req.body.car_status; 
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const input_detail = req.body.input_detail;
  const emp_step1 = req.body.emp_step1;
  const emp_step2 = req.body.emp_step2;;
  const emp_step3 = req.body.emp_step3;
  const emp_step4 = req.body.emp_step4;
  const emp_step5 = req.body.emp_step5;
  const emp_step6 = req.body.emp_step6;
  const emp_step7 = req.body.emp_step7;
  const car_number = req.body.car_number;
  const status_job = '00';
  const car_brand = req.body.car_brand;
  const car_vin = req.body.car_vin;
  const car_year = req.body.car_year;
  const list_name_emp = req.body.list_name_emp;
  const in_car = req.body.in_car;

  db.query(
    "INSERT INTO job_detail (payment, status , first_date, end_date, detail, step1, step2,step3,step4,step5,step6,step7,car_number,status_job,car_brand,car_vin,car_year,list_name_emp,id_car ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [pay_status, car_status , start_date, end_date, input_detail, emp_step1, emp_step2,emp_step3,emp_step4,emp_step5,emp_step6,emp_step7,car_number,status_job,car_brand,car_vin,car_year,list_name_emp,in_car],
    (err, result) => {
      if (err) {
        res.send('error');
      } else {
        //console.log("result")
        //console.log(result)
        res.send('OK!');
      }
    }
  );
});

app.put("/update_count_job", (req, res) => { 
  const count_job = req.body.count_job; 
  const id_car = req.body.id_car;
 
  db.query(
    "UPDATE car SET count_job = ? WHERE id_car = ?",
    [count_job, id_car ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get('/job_detail_list',(req,res)=>{
  db.query("SELECT * FROM job_detail ", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/show_job_detail/:id_job',(req,res)=>{
  const id_job = req.params.id_job;
  db.query("SELECT * FROM job_detail WHERE id_job = ?",id_job, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/show_order_pair/:id_job',(req,res)=>{
  const id_job = req.params.id_job;
  db.query("SELECT * FROM `order_pair` WHERE order_pair.id_job = (SELECT job_detail.id_car FROM job_detail WHERE job_detail.id_job = ?);",id_job, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

//-------------------------------------------------------------------

app.get('/show_employee_step1/:id_job',(req,res)=>{
  const id_job = req.params.id_job;
  db.query("SELECT * FROM `employee` WHERE employee.id_employee = (SELECT job_detail.step1 FROM job_detail WHERE job_detail.id_job = ?);",id_job, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/show_employee_step2/:id_job',(req,res)=>{
  const id_job = req.params.id_job;
  db.query("SELECT * FROM `employee` WHERE employee.id_employee = (SELECT job_detail.step2 FROM job_detail WHERE job_detail.id_job = ?);",id_job, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/show_employee_step3/:id_job',(req,res)=>{
  const id_job = req.params.id_job;
  db.query("SELECT * FROM `employee` WHERE employee.id_employee = (SELECT job_detail.step3 FROM job_detail WHERE job_detail.id_job = ?);",id_job, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/show_employee_step4/:id_job',(req,res)=>{
  const id_job = req.params.id_job;
  db.query("SELECT * FROM `employee` WHERE employee.id_employee = (SELECT job_detail.step4 FROM job_detail WHERE job_detail.id_job = ?);",id_job, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/show_employee_step5/:id_job',(req,res)=>{
  const id_job = req.params.id_job;
  db.query("SELECT * FROM `employee` WHERE employee.id_employee = (SELECT job_detail.step5 FROM job_detail WHERE job_detail.id_job = ?);",id_job, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/show_employee_step6/:id_job',(req,res)=>{
  const id_job = req.params.id_job;
  db.query("SELECT * FROM `employee` WHERE employee.id_employee = (SELECT job_detail.step6 FROM job_detail WHERE job_detail.id_job = ?);",id_job, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/show_employee_step7/:id_job',(req,res)=>{
  const id_job = req.params.id_job;
  db.query("SELECT * FROM `employee` WHERE employee.id_employee = (SELECT job_detail.step7 FROM job_detail WHERE job_detail.id_job = ?);",id_job, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

// app.get('/show_employee_step7/:id_job',(req,res)=>{
//   const id_job = req.params.id_job;
//   db.query("",id_job, (err,result)=>{
//     if(err){
//       console.log(err);
//     }
//     else{
//       res.send(result);
//     }
//   });
// });




app.put("/update_status_job", (req, res) => { 
  const status_job = req.body.status_job; 
  const id_job = req.body.id_job;
 
  db.query(
    "UPDATE job_detail SET status_job = ? WHERE id_job = ?;",
    [status_job, id_job ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.put("/update_status_job_ceo", (req, res) => { 
  const status_job = req.body.status_job; 
  const id_job = req.body.id_job;
 
  db.query(
    "UPDATE job_detail SET status_job = ? WHERE id_job = ?;",
    [status_job, id_job ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get('/job_status_00',(req,res)=>{
  //const id_job = req.params.id_job;
  db.query("SELECT COUNT(*) as ct FROM `job_detail` WHERE status_job = '00';", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/job_status_01',(req,res)=>{
  //const id_job = req.params.id_job;
  db.query("SELECT COUNT(*) as ct FROM `job_detail` WHERE status_job = '01';", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});


app.get('/job_status_02',(req,res)=>{
  //const id_job = req.params.id_job;
  db.query("SELECT COUNT(*) as ct FROM `job_detail` WHERE status_job = '02';", (err,result)=>{
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
