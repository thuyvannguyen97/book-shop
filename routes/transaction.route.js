var express = require('express');

var router = express.Router();
var controller = require('../controllers/transaction.controller');
var authMiddleware = require('../middlewares/auth.middleware');

router.get('', controller.index);

//create
router.get('/create', authMiddleware.requireAdmin, controller.create);
router.post('/create', controller.postCreate);

router.get('/complete/:id', authMiddleware.requireAdmin, controller.complete);

router.get('/delete/:id', authMiddleware.requireAdmin, controller.delete);
module.exports = router;