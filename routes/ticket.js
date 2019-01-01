var express = require('express');

var router = express.Router({mergeParams: true});
const ticketController = require('../controllers/ticket');


router.get('/create', ticketController.createForm);
router.post('/create', ticketController.create);

router.get('/:id', ticketController.details);
router.put('/:id/update', ticketController.update);
router.delete('/:id/delete', ticketController.delete);

router.get('/', ticketController.list);


module.exports = router;
