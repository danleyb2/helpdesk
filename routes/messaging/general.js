var express = require('express');
var router = express.Router({mergeParams: true});

messagingController = require('../../controllers/messaging/general');


router.get('/', messagingController.list);
router.get('/:id', messagingController.details);


module.exports = router;
