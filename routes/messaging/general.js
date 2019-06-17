var express = require('express');
var router = express.Router({mergeParams: true});

messagingController = require('../../controllers/messaging/index');


router.get('/', messagingController.list);
router.get('/:id', messagingController.details);
router.post('/:id/ticket', messagingController.ticket);


module.exports = router;
