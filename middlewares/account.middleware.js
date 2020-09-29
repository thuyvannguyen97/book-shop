var User = require('../models/user.model');

module.exports.isAdmin = async function(req, res, next) {
  if(!req.signedCookies.userId) {
    res.locals.isAdmin = false;
  }
  try{
    var user = await User.findById(req.signedCookies.userId);
    if(!user) {
      res.locals.isAdmin = false;
    }
    else if(!user.isAdmin) {
      res.locals.isAdmin = false;
    }
    else {
      res.locals.isAdmin = true;
    }
  } catch(err) {
    next(err);
    //transmit err to Error Handler middleware   
  }
  next();
};
  module.exports.isUser = async (req, res, next) => {
    if(req.signedCookies.userId) {
      try {
        var user = await User.findById(req.signedCookies.userId);
        if(user) {
          res.locals.user = user;
        }
      } catch(err) {
        next(err);
      }
    }
    next();
  }
