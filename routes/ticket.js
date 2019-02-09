var express = require('express');

var router = express.Router({mergeParams: true});
const ticketController = require('../controllers/ticket');


router.get('/create', ticketController.createForm);
router.post('/create', ticketController.create);

router.get('/:tId', ticketController.details);
router.put('/:tId/update', ticketController.update);
router.delete('/:tId/delete', ticketController.delete);

router.get('/', ticketController.list);


module.exports = router;
