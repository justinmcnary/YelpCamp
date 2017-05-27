let express = require('express');
let app = express();

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

let request = require('request');

app.set("view engine", "ejs");

  let campgrounds = [
    {name: "Salmon Creek", image: "https://farm5.staticflickr.com/4016/4369518024_0f64300987.jpg"},
    {name: "Goats Peak", image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"},
    {name: "Titans Bluff", image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg"}
  ]

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', {campgrounds:campgrounds});
});

app.post('/campgrounds', (req, res) => {
  let name = req.body.name;
  let image = req.body.image;
  let newCampground = {name: name, image: image};
  campgrounds.push(newCampground);
  res.redirect('/campgrounds');
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