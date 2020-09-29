var express = require('express');

var router = express.Router();
var controller = require('../controllers/transaction.controller');
// var authMiddleware = require('../middlewares/auth.middleware');

router.get('/', controller.index);

//create
router.post('/', controller.postCreate);

//complete
router.patch("/:id", controller.complete);;

//delete
router.delete('/:id', controller.delete);

module.exports = router;