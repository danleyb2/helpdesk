var express = require('express');
var router = express.Router();

var searchController = require('../controllers/search');


router.get('/', searchController.search);

module.exports = router;
