var User = require('../models/user.model');

//require login
module.exports.requireAuth = async function(req, res, next) {
  if(!req.signedCookies.userId) {
    res.render('auth/login', {
            message: 'Please login to continue',
        });
    return;
  }
  try{
    var user = await User.findById(req.signedCookies.userId);
  
    // de truy xuat vao user o controller
    // req.user = user;
    if(!user) {
      res.render('auth/login', {
              message: 'Please login to continue',
          });
      return;
    }
    // res.locals.user = user;
  } catch(err) {
    next(err);
  }
  next();
}

module.exports.requireAdmin = async function(req, res, next) {
  if(!req.signedCookies.userId) {
    res.render('404');
    return;
  }
  try{
    var user = await User.findById(req.signedCookies.userId);
    if(!user) {
      res.render('404');
      return;
    }
    else if(!user.isAdmin) {
      res.render('404');
      return;
    }
    else {
      res.locals.isAdmin = true;
    }
  } catch(err) {
    next(err);
  }
  next();
}