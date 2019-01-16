var Conversation = require('../models/chat/conversation');
var Contact = require('../models/contact');
var Ticket = require('../models/ticket');


exports.search = function (req, res) {

    Ticket.find({})
        //.sort('createdAt')
        .exec(function (err, tickets) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.render('search/all', {title: 'Search', 'tickets': tickets});
        });


};
