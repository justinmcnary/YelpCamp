let express  = require('express'),
  app        = express(),
  bodyParser = require('body-parser'),
  mongoose   = require('mongoose'),
  request    = require('request')

mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
let campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});

let Campground = mongoose.model('Campground', campgroundSchema);

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  //Geat all campgrounds
  Campground.find({}, (err, allCampgrounds)=> {
    if(err){
      console.log(`There was an error ${err}`);
    } else{
      res.render('campgrounds', {campgrounds:allCampgrounds});
    }
  });
});

app.post('/campgrounds', (req, res) => {
  let name = req.body.name;
  let image = req.body.image;
  let newCampground = {name: name, image: image};
  //Create new campground and save to database
  Campground.create(newCampground, (err, newlyCreated) => {
    if(err){
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

app.get('*', (req,res) => {
  res.render('mistake');
});

app.listen(3000, function() {
  console.log('The server is live! on Port 3000.');
})