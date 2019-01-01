var express = require('express');


var router = express.Router();
const propertyController = require('../controllers/property');

propertyMessagingRouter = require('./messaging/property');
propertyAdministrationRouter = require('./administration');
propertyTicketsRouter = require('./ticket');


router.get('/create', propertyController.createForm);
router.post('/create', propertyController.create);

router.get('/:pId', propertyController.details);
router.put('/:pId/update', propertyController.update);
router.delete('/:pId/delete', propertyController.delete);

router.use('/:pId/m',propertyMessagingRouter);
router.use('/:pId/s',propertyAdministrationRouter);
router.use('/:pId/t',propertyTicketsRouter);

router.get('/', propertyController.list);


module.exports = router;
