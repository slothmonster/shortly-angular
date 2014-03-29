var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var dbM = require('../app/mongDb');

var User = require('../app/models/user');
var Link = require('../app/models/link');


var Promise = require('bluebird');
var getUrlTitle = Promise.promisify(util.getUrlTitle);
Link = Promise.promisifyAll(Link);


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  console.log("getting links");
   Link.find({},function(err, links) {
     console.log("link", links);
     res.send(200, links);
   });
};

exports.saveLink = function(req, res) {

  var uri = req.body.url;
 // var uri = "http://www.google.com";
  console.log("saving link");

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findAsync({ url: uri })
  .then(function(links){
    if(links.length !== 0) {
      res.send(links[0]);
      return null;
    } else {
      return getUrlTitle(uri);
    }
  })
  .then(function(title){
    if(title === null) return null;
    return Link.createAsync({
          url: uri,
          base_url:req.headers.origin,
          title: title
        });
  })
  .then(function(link){
    if(link === null) return;
    res.send(link);
  })
  .caught(function(err){
    console.error("ERROR: ", err);
    res.status(503).send("internal server error");
  });


  // Link.findAsync({ url: uri })
  // .then(function(found){
  //   if (found) {
  //     console.log("found");
  //     res.send(200, found);
  //   } else {
  //     console.log("not found");

  //     util.getUrlTitle(uri, function(err, title) {
  //       if (err) {
  //         console.log('Error reading URL heading: ', err);
  //         return res.send(404);
  //       }
  //       var link = new Link({
  //         url: uri,
  //         base_url:req.headers.origin,
  //         title: title
  //       });

  //       link.save(function (err, link) {
  //         if (err) return console.error("errorrr");
  //         console.log("tryignt os ageve", link);
  //         res.send(200, link);
  //       });
  //     });
  //   }
  // });

  //////******* Bookshelf and SQLLite code ******\\\\\\\
  //new Link({ url: uri }).fetch().then(function(found) {
  //   if (found) {
  //     res.send(200, found.attributes);
  //   } else {
  //     util.getUrlTitle(uri, function(err, title) {
  //       if (err) {
  //         console.log('Error reading URL heading: ', err);
  //         return res.send(404);
  //       }

  //       var link = new Link({
  //         url: uri,
  //         title: title,
  //         base_url: req.headers.origin
  //       });

  //       link.save().then(function(newLink) {
  //         Links.add(newLink);
  //         res.send(200, newLink);
  //       });
  //     });
  //   }
  // });
};

exports.loginUser = function(req, res) {
  var Userss = Promise.promisifyAll(User);

  Userss.findAsync({username: req.body.username})
    .then(function(user) {
      //console.log("user ", user);
       if (!user[0]) {
        console.log("can't find suer");
         res.redirect('/login');
        } else {
          user[0].comparePassword(req.body.password, function(match){
             if (match) {
              console.log("matchhed");
              util.createSession(req, res, user);
             } else {
              console.log("redirect user");
              res.redirect('/login');
             }
          });
        }
      });

  //////******* Bookshelf and SQLLite code ******\\\\\\\
  // var username = req.body.username;
  // var password = req.body.password;

  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       res.redirect('/login');
  //     } else {
  //       user.comparePassword(password, function(match) {
  //         if (match) {
  //           util.createSession(req, res, user);
  //         } else {
  //           res.redirect('/login');
  //         }
  //       })
  //     }
  // });
};

exports.signupUser = function(req, res) {

//////******* Bookshelf and SQLLite code ******\\\\\\\
  //  var user = new User({
  //      username: req.body.username,
  //      password:  req.body.password
  //  });

  // user = Promise.promisifyAll(user);

  //  user.saveAsync()
  //   .then(function(newUser) {
  //     util.createSession(req, res, newUser);
  //       //res.send(200, user);
  //   });

  var Userss = Promise.promisifyAll(User);

  Userss.findAsync({username: req.body.username})
    .then(function(user) {
      console.log("user ", user);
       if (!user[0]) {

          //user = Promise.promisifyAll(user);

          Userss.createAsync({
            username: req.body.username,
            password:  req.body.password
          })
          .then(function(newUser) {
            util.createSession(req, res, newUser);
          });

        } else {
            console.log('Account already exists');
            res.redirect('/signup');
        }
      });

//////******* Bookshelf and SQLLite code ******\\\\\\\
  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       var newUser = new User({
  //         username: username,
  //         password: password
  //       });
  //       newUser.save()
  //       .then(function(newUser) {
  //           util.createSession(req, res, newUser);
  //           Users.add(newUser);
  //         });
  //     
  //     } else {
  //       console.log('Account already exists');
  //       res.redirect('/signup');
  //     }
  //   })
};

exports.navToLink = function(req, res) {
 //////******* Bookshelf and SQLLite code ******\\\\\\\
  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
    Link.findOneAndUpdate({ 'code': req.params[0] }, { $inc: { 'visits': 1 }}, function (err, link) {
      if (err || !link){
        res.redirect('/');
        return;
      }
      console.log(link);
      res.redirect(link.url); // Space Ghost is a talk show host.
    })

};