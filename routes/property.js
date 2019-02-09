var express = require('express');


var router = express.Router({mergeParams: true});
const propertyController = require('../controllers/property');
administrationController = require('../controllers/administration');

propertyMessagingRouter = require('./messaging/property');
propertyAdministrationRouter = require('./administration');

var Property = require('../models/property');

router.param('pId', function (req, res, next, id) {
    Property.findOne({_id:id},function (err, property) {
            if (err) {
                next(err);
            } else if (property) {
                res.locals.title = 'Administration';
                res.locals.property = property;
                next();
            } else {
                next(new Error('failed to load property'));

            }
        });
});


router.get('/create', propertyController.createForm);
router.post('/create', propertyController.create);

router.get('/:pId', propertyController.details);
router.post('/:pId/update', propertyController.update);
router.delete('/:pId/delete', propertyController.delete);

router.use('/:pId/m', propertyMessagingRouter);
router.use('/:pId/s', propertyAdministrationRouter);

router.get('/:pId/members', administrationController.members);
router.post('/:pId/members', administrationController.memberCreate);

router.get('/:pId/departments', administrationController.departments);

router.get('/', propertyController.list);


module.exports = router;
