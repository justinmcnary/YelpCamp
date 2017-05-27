let express = require('express');
let app = express();

let bodyParser = require('body-parser');
let request = require('request');

app.set("view engine", "ejs");


app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  let campgrounds = [
    {name: "Salmon Creek", image: "https://farm5.staticflickr.com/4016/4369518024_0f64300987.jpg"},
    {name: "Goats Peak", image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"},
    {name: "Titans Bluff", image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg"}
  ]
  res.render('campgrounds', {campgrounds:campgrounds});
})


app.listen(3000, function() {
  console.log('The server is live! on Port 3000.');
})