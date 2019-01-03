var Conversation = require('../models/chat/conversation');


exports.list = function (req, res) {

    Conversation.find({})
        .sort('createdAt')
        .exec(function (err, conversations) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.render('messaging/list', {title: 'Conversations', 'conversations': conversations});
        });


};


exports.details = function (req, res) {
    Conversation.findById(req.params.id, function (err, conversation) {
        if (err) return console.error(err);

        conversation.recentMessages(function (err,messages) {

            res.render('messaging/detail', {
                title: 'Conversation',
                'conversation': conversation,
                'messages': messages
            });

        });


    })
};
