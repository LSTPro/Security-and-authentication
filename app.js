//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const process = require('process');
var encrypt = require('mongoose-encryption');

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.set('useUnifiedTopology', true)
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true})
const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields: ['password'] });
const User = mongoose.model("User", userSchema);

const joe = new User({
  email:"1@2.com",
  password:"123"
}) ;

// joe.encrypt(function (err) {
//   if (!err) {
//     console.log(joe);
//     console.log(joe.password);
//   }
//   else {
//     console.log(err);
//   }
// });

app.get("/", function (req, res) {
  res.render("home");
})

app.get("/login", function (req, res) {
  res.render("login");
})
app.post("/login",function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username}, function (err,foundUser) {
    if(!err){
      if (foundUser.password === password) {
        res.render("secrets")
      }
    }else {
      console.log(err);
    }
  })
})

app.get("/register", function (req, res) {
  res.render("register");
})

app.get("/secrets", function (req, res) {
  res.render("secrets");
})

app.get("/submit", function (req, res) {
  res.render("submit");
})

app.post("/register", function (req, res) {
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function (err) {
    if(err){
      console.log(err);
    }else {
      console.log("New user registered.");
      res.render("secrets")
    }
  })
})






app.listen(3000,function () {
  console.log("Server running at port 3000");
})
