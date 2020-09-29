var express = require('express');
const multer = require('multer');

var controller = require('../controllers/shop.controller');

var router = express.Router();
const upload = multer({ dest: 'public/uploads/' });

//show list of books
router.get('/:userId/books', controller.index);

//search
router.get('/:userId/books/search', controller.search);

//seller channel
router.get('/:userId/portal', controller.channel);

//all books
router.get('/:userId/portal/books', controller.manageBooks);

//add a book
router.get('/:userId/books/add', controller.addBook);
router.post('/:userId/books/add', upload.single('cover'), controller.postAddBook);

//update a book
router.get('/:userId/books/update/:id', controller.updateBook);
router.post('/:userId/books/update/:id', upload.single('cover'), controller.postUpdateBook);

//delete a book
router.get('/:userId/books/delete/:id', controller.deleteBook);

//all customer's transactions
router.get('/:userId/portal/transactions', controller.manageTrans);

router.get('/:userId/portal/transactions/complete/:id', controller.complete);

router.get('/:userId/portal/transactions/delete/:id', controller.delete);

module.exports = router;