require("dotenv").config();
var cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const saltRounds = 10;

var User = require("../../models/user.model");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

module.exports.index = async function(req, res) {
  var page = parseInt(req.query.page) || 1;
  var perPage = 8;

  var start = (page - 1) * perPage;
  var end = page * perPage;
  try {
    var users = await User.find();
    var numOfPages = Math.ceil(users.length / perPage);

    res.json({
      users: users.slice(start, end),
      currentPage: page,
      numOfPages: numOfPages
    });
  } catch (err) {
    console.log(err);
  }
};

//search
module.exports.search = async function(req, res) {
  var page = parseInt(req.query.page) || 1;
  var perPage = 8;
  var start = (page - 1) * perPage;
  var end = page * perPage;

  var q = req.query.q;
  try {
    var users = await User.find();
    var matchedList = users.filter(user => {
      return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });

    var numOfPages = Math.ceil(matchedList.length / perPage);

    res.json({
      users: matchedList,
      currentPage: page,
      numOfPages: numOfPages,
      value: q
    });
  } catch (err) {
    console.log(err);
  }
};

//add a user
module.exports.postAdd = async function(req, res) {
  if (req.body.isAdmin) {
      req.body.isAdmin = true;
    }
    req.body.isAdmin = false;
    try {
      req.body.password = await bcrypt.hash(req.body.password, saltRounds);
      var user = User.create(req.body, function(err, small) {
        if (err) console.log(err);
      });
    } catch(err) {
      console.log(err);
    }
  res.json(user);
};

//update a user
module.exports.postUpdate = async function(req, res) {
  var id = req.params.id;
  if (req.body.isAdmin) {
    req.body.isAdmin = true;
  }
  req.body.isAdmin = false;
  try {
    var user = await User.findById(id, function(err, doc) {
      doc.name = req.body.name;
      doc.phone = req.body.phone;
      doc.email = req.body.email;
      doc.isAdmin = req.body.isAdmin;
      doc.save();
    });
  } catch (err) {
    console.log(err);
  }
  res.json(user);
};

//delete a user
module.exports.delete = async function(req, res) {
  var id = req.params.id;
  try {
    await User.deleteOne({ _id: id });
  } catch (err) {
    console.log(err);
  }
};
