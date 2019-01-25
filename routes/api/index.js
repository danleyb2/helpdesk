const express = require('express'),
    v1ApiController = require('./v1');

let router = express.Router({mergeParams: true});


router.use('/v1', v1ApiController);
// router.use('/v2', v2ApiController);


module.exports = router;
