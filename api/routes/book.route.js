var express = require('express');
const multer = require('multer');

var controller = require('../controllers/book.controller');

var router = express.Router();
const upload = multer({ dest: 'public/uploads/' });

//show list of books
router.get('/', controller.index);

//search
router.get('/search', controller.search);
//add a book
router.post('/', upload.single('cover'), controller.postAdd);

//update a book
router.patch('/:id', upload.single('cover'), controller.postUpdate);

//delete a book
router.delete('/:id', controller.delete);

module.exports = router;