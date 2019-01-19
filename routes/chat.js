var express = require('express');
var router = express.Router({mergeParams: true});

const chatController = require('../controllers/chat');

router.get('/:pId', chatController.details);

module.exports = router;
