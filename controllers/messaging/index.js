var Conversation = require('../../models/chat/conversation');

exports.list = function (req, res) {

    Conversation.findOrderByLastMessage(req.properties, function (err, conversations) {
        if (err) return next(err);
        res.render('messaging/conversations', {title: 'Conversations', 'conversations': conversations});

    });

};


exports.details = function (req, res) {

    Conversation.findOrderByLastMessage(req.properties, function (err, conversations) {
        if (err) {
            return next(err);
        }
        if (req.params.id) {
            Conversation.findById(req.params.id, function (err, conversation) {
                if (err) return next(err);
                conversation.recentMessages(function (err, messages) {
                    res.render('messaging/conversations', {
                        title: 'Conversation',
                        'conversations': conversations,
                        'currentConversation': conversation,
                        'messages': messages
                    });

                });
            });

        } else {
            res.render('messaging/conversations', {
                title: 'Conversation',
                'conversations': conversations,
                'currentConversation': undefined,
                'messages': []
            });

        }

    });


};
