//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose
  .connect("mongodb://localhost:27017/projectsdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  })
  .then(() => {
    console.log("DB is connected");
  });

mongoose.set("useCreateIndex", true);

const projectsSchema = {
    name:{
        type: String
    },
    password:{
      type: String
    }
  };
  
  const Project = mongoose.model("Project", projectsSchema);
  
app.get("/login",function(req,res){
res.render("login");
});

app.post("/login",function(req,res){
let username = req.body.username;
let password = req.body.password;
Project.findOne({name: username,password: password},function(err,project){
  if (err){
    console.log(err);
  }

  if (!project){
    return res.status(404).send();
  }
  return res.redirect("/");
});
});

app.get("/",function(req,res){
    
    res.render("index");
});

// app.get("/signup",function(req,res){
    
//   res.render("signup");
// });


// app.get("/Signin",function(req,res){
    
//   res.render("Signin");
// });
app.get("/signup",function(req,res){
  res.render("signup");
});


app.post("/signup",function(req,res){
  const project = new Project({
    name: req.body.name,
    password: req.body.password
  });


  project.save(function(err){
    if (!err){
        res.redirect("/login");
    }
  });
});


app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  