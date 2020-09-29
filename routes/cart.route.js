var express = require('express');

var router = express.Router();

var controller = require('../controllers/cart.controller');
var authMiddleware = require('../middlewares/auth.middleware');

router.get('', controller.index);
router.get('/add/:bookId', controller.addToCart);
router.get('/delete/:bookId', controller.delete);
router.get('/checkout',authMiddleware.requireAuth, controller.checkout);

module.exports = router;