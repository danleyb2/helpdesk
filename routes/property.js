var express = require('express');


var router = express.Router();
const propertyController = require('../controllers/property');

propertyMessagingRouter = require('./messaging/property');
propertyAdministrationRouter = require('./administration');

var Property = require('../models/property');
function loadProperty(req, res, next) {
    Property.findOne({_id:req.params.pId})
        .exec(function (err, property) {
            if (err) {
                return next(err);
            }

            res.locals.title = 'Administration';
            res.locals.property = property;

            return next();
        });


}


router.get('/create', propertyController.createForm);
router.post('/create', propertyController.create);

router.get('/:pId', propertyController.details);
router.put('/:pId/update', propertyController.update);
router.delete('/:pId/delete', propertyController.delete);

router.use('/:pId/m',propertyMessagingRouter);
router.use('/:pId/s', loadProperty, propertyAdministrationRouter);

router.get('/', propertyController.list);


module.exports = router;
