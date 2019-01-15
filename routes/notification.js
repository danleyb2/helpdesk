var express = require('express');

var router = express.Router({mergeParams: true});
const notificationController = require('../controllers/notification.js');


router.get('/', notificationController.list);


module.exports = router;
