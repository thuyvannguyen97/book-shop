var express = require('express');
const multer = require('multer');

var controller = require('../controllers/book.controller');
var authMiddleware = require('../middlewares/auth.middleware');

var router = express.Router();
const upload = multer({ dest: 'public/uploads/' });
//var books = db.get('books');

//show list of books
router.get('', controller.index);

//search
router.get('/search', controller.search);
//add a book
router.get('/add', authMiddleware.requireAdmin, controller.add);
router.post('/add', upload.single('cover'), controller.postAdd);

//update a book
router.get('/update/:id', authMiddleware.requireAdmin, controller.update);
router.post('/update/:id', upload.single('cover'), controller.postUpdate);

//delete a book
router.get('/delete/:id', authMiddleware.requireAdmin, controller.delete);

//detail
router.get('/detail/:id', controller.detail);
module.exports = router;