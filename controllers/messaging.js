var Conversation = require('../models/chat/conversation');


exports.list = function (req, res) {

    Conversation.find({})
        .exec(function (err, conversations) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.render('messaging/list', {title: 'Conversation', 'conversations': conversations});
        });


};
