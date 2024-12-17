var express = require('express');
var router = express.Router();

//requiring usermodel
const userModel= require("./users");

//requiring passport
const passport= require('passport');
const localStrategy= require('passport-local');
passport.authenticate(new localStrategy(userModel.authenticate()));

/* GET home page. -- THIS WILL BE THE HOME PAGE */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pustakalay' });
});



//PROFILE BACKEND
//only work if loggedin
router.get('/profile',isLoggedIn,function(req,res,next){
  res.send("profile")
});

//REGISTER BACKEND
router.post('/register',function(req,res){
  //esko reduce krke bhi likha ja skta hai 
  /* something like this 
  const{name,email,Phone_no} = req.body;
  const userData = ({name,email, Phone_no }); */

  const userData = new userModel({
    name :req.body.name,
  email :req.body.email,
  Phone_no :req.body.Phone_no,
  })  

  //send the user from register page to profile page as it got registered
  userModel.register(userData,req.body.password)
  .then(function(){
      passport.authenticate("local")(req,res, function(){
        res.redirect('/login');
      })
  })
})

//LOGIN BACKEND
router.post('/login', passport.authenticate("local",{
  successRedirect: "/home",
  failureRedirect: "/login"
}), function(req,res){
});

//LOGOUT BACKEND
router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect('/register')
}

module.exports = router;
