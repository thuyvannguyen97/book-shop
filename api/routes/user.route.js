var express = require('express');
const multer = require('multer');

var controller = require('../controllers/user.controller');

var router = express.Router();
const upload = multer({ dest: 'public/uploads/' });

//show list of users
router.get('/', controller.index);

//search
router.get('/search', controller.search);
//add a user
router.post('/', upload.single('avatar'), controller.postAdd);

//update a user
router.patch('/:id', upload.single('avatar'), controller.postUpdate);

//delete a user
router.delete('/:id', controller.delete);

module.exports = router;