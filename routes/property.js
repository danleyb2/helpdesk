var express = require('express');


var router = express.Router();
const propertyController = require('../controllers/property');

propertyMessagingRouter = require('./messaging/property');


router.get('/create', propertyController.createForm);
router.post('/create', propertyController.create);

router.get('/:id', propertyController.details);
router.put('/:id/update', propertyController.update);
router.delete('/:id/delete', propertyController.delete);

router.use('/:id/m',propertyMessagingRouter);

router.get('/', propertyController.list);


module.exports = router;
