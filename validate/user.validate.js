// var db = require('../db');
var User = require('../models/user.model');

module.exports.postAdd = async function(req, res, next) {
  var errors = [];
  if(!req.body.name) {
    errors.push('Name is required');
  }
  if(!req.body.email) {
    errors.push('Email is required');
  }
  var user = await User.findOne({email: req.body.email});
  if(user) {
    errors.push('Email existed');
  }
  if(!req.body.phone) {
    errors.push('Phone is required');
  }
  if(req.body.name.length > 30) {
    errors.push('Name cannot be longer than 30 leters');
  }
  if(errors.length) {
    res.render('users/add', {
      errors: errors,
      values: req.body
    });
    return;
  }
  next();
}

module.exports.postUpdate = function(req, res, next) {
  var errors = [];
  if(!req.body.name) {
    errors.push('Name is required');
  }
  if(!req.body.email) {
    errors.push('Email is required');
  }
  if(!req.body.phone) {
    errors.push('Phone is required');
  }
  if(req.body.name.length > 30) {
    errors.push('Name cannot be longer than 30 leters');
  }
  if(errors.length) {
    res.render('users/update', {
      errors: errors,
      values: req.body
    });
    return;
  }
  next();
}