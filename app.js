require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const encrypt =require("mongoose-encryption");
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/usersDB");
const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
const User = mongoose.model("User",userSchema);


app.get("/",(req,res)=>{
    res.render("home");
});

app.route("/register")
.get((req,res)=>{
    res.render("register");

})
.post((req,res)=>{
    const userData = new User({
        email:req.body.email,
        password:req.body.password
    });
    userData.save((err)=>{
        if(err){
            res.send(err);
        }else{
            res.render("secrets");
        }
    });
});

app.route("/login")
.get((req,res)=>{
    res.render("login");
})
.post((req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email:email},(err,user)=>{
      if(err){
        console.log(err);
      }else if(user){
         if(user.password ===password){
            res.render("secrets");
         }
      }
    });
});




app.get("/submit",(req,res)=>{
    res.render("submit");
});


app.listen(4000,()=>{
    console.log("server fired");
})
