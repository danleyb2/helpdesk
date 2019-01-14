var express = require('express');
var router = express.Router({mergeParams: true});

administrationController = require('../controllers/administration');


router.get('/', administrationController.index);
router.get('/members', administrationController.members);
router.post('/members', administrationController.memberCreate);

// router.get('/:id', administrationController.details);


module.exports = router;
