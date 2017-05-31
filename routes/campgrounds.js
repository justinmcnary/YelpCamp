let express = require('express');
let router = express.Router();
let Campground = require('../models/campground');

//Create add new campground to database
router.post('/', isLoggedIn, (req, res) => {
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let author = {
    id: req.user._id,
    username:req.user.username
  };
  let newCampground = {name: name, image: image, description: desc, author:author};
  //Create new campground and save to database
  Campground.create(newCampground, (err, newlyCreated) => {
    if(err){
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

//NEW displays form to make new campground
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

//shows info about one campground
router.get('/:id', (req, res) => {
  //find campground by ID then render show template
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if(err){
      console.log(err);
    } else {
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router;