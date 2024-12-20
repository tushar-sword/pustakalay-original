var express = require('express');
var router = express.Router();

//requiring usermodel
const userModel= require("./users");

//requiring passport
const passport= require('passport');
const localStrategy= require('passport-local');
passport.use(new localStrategy({ usernameField: 'email' }, userModel.authenticate()));


const path = require('path');
router.use('/public', express.static(path.join(__dirname, 'public')));

/* GET home page. -- THIS WILL BE THE HOME PAGE */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pustakalay' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Pustakalay' });
});

router.get('/home',function(req,res,next){
  res.render('home', { title: 'Pustakalay' })
});



//REGISTER BACKEND
router.post('/register',function(req,res){
  //esko reduce krke bhi likha ja skta hai 
  const{name,email,Phone_no} = req.body;
 

  const userData = new userModel({
    name :req.body.name,
  email :req.body.email,
  Phone_no :req.body.Phone_no,
  })  

  //send the user from register page to profile page as it got registered
  userModel.register(userData, req.body.password)
  .then(function () {
      passport.authenticate("local")(req, res, function () {
        console.log("Registration successful, redirecting to login page...");
          res.redirect("/home"); // Redirect to login page
      });
  })
  .catch(function (err) {
      console.error("Registration error:", err);
      if (err.code === 11000) { // Duplicate key error
          res.status(400).send("Email or Phone number already exists. Please use a different one.");
      } else {
          res.status(500).send("Registration failed. Please try again.");
      }
  });
})

//LOGIN BACKEND
router.post("/", passport.authenticate("local",{
  successRedirect: "/home",
  failureRedirect: "/"
}), function(req,res){
});

//LOGOUT BACKEND
router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect('/register')
}

module.exports = router;
