var count = 0;
module.exports.cookie = function(req, res, next) {
    if(req.cookies){
    console.log('cookies: '+ ++count);
  }
  next();
}