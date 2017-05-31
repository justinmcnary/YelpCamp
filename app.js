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

//Requiring routes
let campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes    = require('./routes/comments'),
    indexRoutes       = require('./routes/index')

mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public')) //underscore undersocre dirname

// seedDB(); //seed the database

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
app.use(indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes); //dry up the route 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.listen(process.env.PORT || 3005, function() {
  console.log('The server is live! on Port 3005.');
})