var express = require('express');
var router = express.Router();

administrationController = require('../controllers/administration');


router.get('/', administrationController.list);
router.get('/:id', administrationController.details);


module.exports = router;
