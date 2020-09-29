require("dotenv").config();
// var md5 = require('md5');
var cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const saltRounds = 10;

var User = require("../models/user.model");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

module.exports = {
  index: async function(req, res) {
    try {
      var users = await User.find();
      // console.log(users)
      var currentPage = parseInt(req.query.page) || 1;
      var perPage = 10;
      var start = (currentPage - 1) * perPage;
      var end = currentPage * perPage;
      var numOfPages = Math.ceil(users.length / perPage);

      res.render("users/index", {
        users: users.slice(start, end),
        numOfPages: numOfPages,
        currentPage: currentPage
      });
    } catch (err) {
      console.log(err);
    }
  },
  search: async function(req, res) {
    try {
      var users = await User.find();
      var currentPage = parseInt(req.query.page) || 1;
      var perPage = 10;
      var start = (currentPage - 1) * perPage;
      var end = currentPage * perPage;
      var q = req.query.q;

      var matchedUsers = users.filter(user => {
        return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
      });

      var numOfPages = Math.ceil(matchedUsers.length / perPage);
      res.render("users/index", {
        users: matchedUsers.slice(start, end),
        queryInput: q,
        numOfPages: numOfPages,
        currentPage: currentPage
      });
    } catch (err) {
      console.log(err);
    }
  },
  add: function(req, res) {
    res.render("users/add");
  },
  postAdd: async function(req, res) {
    if (req.body.isAdmin) {
      req.body.isAdmin = true;
    }
    req.body.isAdmin = false;
    try {
      req.body.password = await bcrypt.hash(req.body.password, saltRounds);
      User.create(req.body, function(err, small) {
        if (err) console.log(err);
      });
    } catch(err) {
      console.log(err);
    }
    res.redirect("/users");
  },
  update: async function(req, res) {
    var id = req.params.id;
    try {
      var user = await User.findById(id);
      res.render("users/update", {
        user: user
      });
    } catch (err) {
      console.log(err);
    }
  },
  postUpdate: async function(req, res) {
    var id = req.params.id;
    if (req.body.isAdmin) {
      req.body.isAdmin = true;
    }
    req.body.isAdmin = false;
    try {
      await User.findById(id, function(err, doc) {
        doc.name = req.body.name;
        doc.phone = req.body.phone;
        doc.email = req.body.email;
        doc.isAdmin = req.body.isAdmin;
        doc.save();
      });
    } catch (err) {
      console.log(err);
    }
    res.redirect("/users");
  },
  delete: async function(req, res) {
    var id = req.params.id;
    try {
      await User.deleteOne({ _id: id });  
    } catch(err) {
      console.log(err);
    }
    res.redirect("/users");
  },
  profile: function(req, res) {
    res.render("users/profile/profile", {
      user: res.locals.user
    });
  },
  postProfile: async function(req, res) {
    var id = req.signedCookies.userId;
    try {
      await User.findByIdAndUpdate(id, {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password
      });
    } catch(err) {
      console.log(err);
    }
  },
  avatar: function(req, res) {
    res.render("users/profile/avatar", {
      user: res.locals.user
    });
  },
  postAvatar: async function(req, res) {
    var id = req.signedCookies.userId;
    var path = req.file.path;
    if(!path) {
      path = "https://i.ya-webdesign.com/images/default-avatar-png-18.png";
    }
    try {
      var avatarUrl = await cloudinary.uploader
        .upload(path)
        .then(res => res.url);
      await User.findByIdAndUpdate(id, { avatarUrl: avatarUrl });
    } catch (err) {
      console.log(err);
    }
    res.redirect("/users/profile");
  }
};
