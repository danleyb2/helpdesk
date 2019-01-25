var express = require('express');

var router = express.Router({mergeParams: true});

const ticketController = require('../../../controllers/api/ticket');


router.post('/receive', ticketController.receive);
router.post('/membership/:mId', ticketController.receive);

module.exports = router;
