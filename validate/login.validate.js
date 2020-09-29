module.exports.postLogin = function(req, res, next) {
  var errors = [];
  if(!req.body.email) {
    errors.push('Email is required'); 
  }
  if(!req.body.password) {
    errors.push('Password is required');
  }
  if(errors.length) {
    res.render('auth/login', {
      errors: errors,
      values: req.body
    });
    return;
  }
  next();
}