var express = require('express');
var router = express.Router();

const chatController = require('../controllers/chat');

router.get('/:pId', chatController.details);

module.exports = router;
