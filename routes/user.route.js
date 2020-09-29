var express = require('express');
const shortid = require('shortid');
const multer = require('multer');

var controller = require('../controllers/user.controller');
var authMiddleware = require('../middlewares/auth.middleware');
var validate = require('../validate/user.validate');

var router = express.Router();
const upload = multer({ dest: 'public/uploads/' });

//show list of users
router.get('', authMiddleware.requireAdmin, controller.index);

//search
router.get('/search', authMiddleware.requireAdmin, controller.search)

//add a user
router.get('/add', authMiddleware.requireAdmin, controller.add);
router.post('/add',validate.postAdd, controller.postAdd);

//update a user
router.get('/update/:id', authMiddleware.requireAdmin, controller.update);
router.post('/update/:id',validate.postUpdate, controller.postUpdate);

//delete a user
router.get('/delete/:id', authMiddleware.requireAdmin, controller.delete);

//profile
router.get('/profile', controller.profile);
router.post('/profile', controller.postProfile);

router.get('/profile/avatar', controller.avatar);
router.post('/profile/avatar', upload.single('avatar'), controller.postAvatar);

module.exports = router;