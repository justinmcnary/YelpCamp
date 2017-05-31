let express = require('express');
let router = express.Router();
let passport = require('passport');
let User = require('../models/user');
let Campground = require('../models/campground');

//ROUTE ROUTE
router.get('/', (req, res) => {
  res.render('landing');
});

//Index Route
router.get('/campgrounds', (req, res) => {
  //Geat all campgrounds
  Campground.find({}, (err, allCampgrounds)=> {
    if(err){
      console.log(`There was an error ${err}`);
    } else{
      res.render('campgrounds/index', {campgrounds:allCampgrounds, currentUser: req.user});
    }
  });
});

// AUTH ROUTES
//Show form
router.get('/register', (req, res) => {
  res.render('register');
});

//SIGNUP LOGIC
router.post('/register', (req, res) => {
  let newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err){
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, function(){
      res.redirect('/campgrounds');
    });
  });
});

//SHOW LOGIN form
router.get('/login', (req, res) => {
  res.render('login');
});

//handling login logic
router.post('/login', passport.authenticate('local', 
  {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }), (req, res) => {
});

//LOGOUT ROUTE
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

//Prevents users from commenting unless logged in
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router;