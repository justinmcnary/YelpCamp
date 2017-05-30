let express  = require('express'),
  app        = express(),
  bodyParser = require('body-parser'),
  mongoose   = require('mongoose'),
  request    = require('request'),
  Campground = require('./models/campground'),
  Comment    = require('./models/comment'),
  seedDB     = require('./seed')

mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public')) //underscore undersocre dirname
seedDB();


app.get('/', (req, res) => {
  res.render('landing');
});

//Index Route
app.get('/campgrounds', (req, res) => {
  //Geat all campgrounds
  Campground.find({}, (err, allCampgrounds)=> {
    if(err){
      console.log(`There was an error ${err}`);
    } else{
      res.render('campgrounds/index', {campgrounds:allCampgrounds});
    }
  });
});

//Create add new campground to database
app.post('/campgrounds', (req, res) => {
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let newCampground = {name: name, image: image, description: desc};
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
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

//shows info about one campground
app.get('/campgrounds/:id', (req, res) => {
  //find campground by ID then render show template
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if(err){
      console.log(err);
    } else {
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

// ====================
// Comments Routes
// =====================

app.get('/campgrounds/:id/comments/new', (req, res) => {
  //find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    if(err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

app.post('/campgrounds/:id/comments', (req, res) => {
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
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        }
      })
    };
  })
});

app.listen(process.env.PORT || 3005, function() {
  console.log('The server is live! on Port 3005.');
})