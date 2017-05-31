let mongoose = require('mongoose');
let Campground = require('./models/campground');
let Comment = require('./models/comment');

let data = [
  {name: 'Clouds Rest', image:'https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg',
  description: 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?'
  },
  {name: 'Hilly McHill', image:'https://farm8.staticflickr.com/7258/7121861565_3f4957acb1.jpg',
    description: 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?'
  },
  {name: 'Jupiters BrownEye', image:'https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg',
    description: 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?'
    }
]

function seedDB() {
  //Remove all campgrounds
  Campground.remove({}, (err) => {
    if(err) {
      console.log(err);
    } else {
      console.log('Removed Campgrounds!')
    }
  });
  // add a few campgrounds
  data.forEach((seed) => {
    Campground.create(seed, (err, campground) => {
      if(err) {
        console.log(err);
      } else {
        console.log('added a campground');
        //create a comment
        Comment.create(
          {
          text:'This place is great but could use WIFI!',
          author: 'Homer'
        }, (err, comment) => {
          if(err) {
            console.log(err);
          } else {
            campground.comments.push(comment);
            campground.save();
            console.log('Comment Created');
          }
        });
      }
    });
  }); 
};

module.exports = seedDB;