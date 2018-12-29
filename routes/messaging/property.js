var express = require('express');
var router = express.Router();

messagingController = require('../../controllers/messaging');


router.get('/', messagingController.list);


module.exports = router;
