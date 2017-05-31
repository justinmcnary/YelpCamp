let express = require('express');
let router = express.Router({mergeParams:true}); //allows you to dry route
let Campground = require('../models/campground');
let Comment = require('../models/comment');

//COMMENTS NEW
router.get('/new', isLoggedIn, (req, res) => {
  //find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    if(err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

//COMMENTS CREATE
router.post('/', isLoggedIn, (req, res) => {
//Lookup campground by id
  Campground.findById(req.params.id, (err, campground) => {
    if(err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if(err) {
          console.log(err);
        } else {
          //add username and ID then save comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        }
      })
    };
  })
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router;