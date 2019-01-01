var Ticket = require('../../models/ticket');
// var Member = require('../models/member');

exports.create = function (req, res,next) {

    console.log(req.body);

    let ticket = new Ticket({
        subject: req.body.subject,
        issue: req.body.message,
        property:req.params.pId
    });

    ticket.save(function (err) {
        if (err) {
            return next(err);
        }

        res.send(ticket)

    })
};
