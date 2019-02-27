var Conversation = require('../../models/chat/conversation');
var Ticket = require('../../models/ticket');

exports.list = function (req, res) {

    Conversation.findOrderByLastMessage(req.properties, function (err, conversations) {
        if (err) return next(err);
        res.render('messaging/list', {title: 'Conversations', 'conversations': conversations});

    });

};


exports.details = function (req, res,next) {

    Conversation.findOrderByLastMessage(req.properties, function (err, conversations) {
        if (err) {
            return next(err);
        }
        if (req.params.id) {
            Conversation.findById(req.params.id, function (err, conversation) {
                if (err) return next(err);
                conversation.recentMessages(function (err, messages) {
                    res.render('messaging/detail', {
                        title: 'Conversation',
                        'conversations': conversations,
                        'currentConversation': conversation,
                        'messages': messages
                    });

                });
            });

        } else {
            res.render('messaging/detail', {
                title: 'Conversation',
                'conversations': conversations,
                'currentConversation': undefined,
                'messages': []
            });

        }

    });


};


exports.ticket =  function (req, res,next) {

    Conversation.findById(req.params.id, function (err, conversation) {
        if (err) return next(err);

        let ticket = new Ticket({
            subject: conversation.title,
            issue: req.body.issue,
            department: conversation.department,
            property: conversation.property,
            conversation: conversation._id,
            contact: participant.modelRef,
        });

        ticket.save(function (err) {
            if (err) {
                return next(err);
            }


            // todo change conversation status to ticketed

            res.redirect('/t/')
        });

        conversation.recentMessages(function (err, messages) {
            res.render('messaging/detail', {
                title: 'Conversation',
                'conversations': conversations,
                'currentConversation': conversation,
                'messages': messages
            });

        });
    });


};
