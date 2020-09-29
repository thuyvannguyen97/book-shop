var express = require('express');

var controller = require('../controllers/auth.controller');
var validate = require('../validate/login.validate');

var router = express.Router();

router.get('/login', controller.login);
router.post('/login', validate.postLogin, controller.postLogin);

router.get('/logout', controller.logOut);

router.get('/register', controller.register);
router.post('/register', validate.postLogin, controller.postRegister);

module.exports = router;