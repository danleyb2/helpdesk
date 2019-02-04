var Conversation = require('../models/chat/conversation');
var Contact = require('../models/contact');
var Ticket = require('../models/ticket');


exports.search = function (req, res,next) {

    Ticket.find({
        "property": {$in: req.properties},
        $or: [
            {
                subject: {
                    $regex: req.query.q,
                    $options: 'i'
                }
            },
            {
                issue: {
                    $regex: req.query.q,
                    $options: 'i'
                }
            }]
    }).exec(function (err, tickets) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.render('search/all', {title: 'Search', 'results': tickets});
    });


};
