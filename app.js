let express  = require('express'),
  app        = express(),
  bodyParser = require('body-parser'),
  mongoose   = require('mongoose'),
  passport   = require('passport'),
  LocalStrategy = require('passport-local'),
  request    = require('request'),
  Campground = require('./models/campground'),
  Comment    = require('./models/comment'),
  User       = require('./models/user'),
  seedDB     = require('./seed')

mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public')) //underscore undersocre dirname
seedDB();

//PASSPORT CONFIG
app.use(require('express-session')({
  secret: "TURBO HOCKEY IS LEGIT!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
 });
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


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
      res.render('campgrounds/index', {campgrounds:allCampgrounds, currentUser: req.user});
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

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  //find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    if(err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
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

// AUTH ROUTES
//Show form
app.get('/register', (req, res) => {
  res.render('register');
});

//SIGNUP LOGIC
app.post('/register', (req, res) => {
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
app.get('/login', (req, res) => {
  res.render('login');
});

//handling login logic
app.post('/login', passport.authenticate('local', 
  {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }), (req, res) => {
});

//LOGOUT ROUTE
app.get('/logout', (req, res) => {
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

app.listen(process.env.PORT || 3005, function() {
  console.log('The server is live! on Port 3005.');
})