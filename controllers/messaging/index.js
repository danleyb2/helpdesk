var Conversation = require('../../models/chat/conversation');
var Ticket = require('../../models/ticket');
var Participant = require('../../models/chat/participant');
var mongoose = require('mongoose');


exports.list = function (req, res) {

    Conversation.findOrderByLastMessage(req.properties, function (err, conversations) {
        if (err) return next(err);

        console.debug(JSON.stringify(conversations));

        res.render('messaging/list', {
            title: 'Conversations',
            'conversations': conversations
        });

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

    Conversation.findById(req.params.id, async function (err, conversation) {
        if (err) return next(err);

        console.log(req.body);

        let participantIds = conversation.participants.map(p => new mongoose.Types.ObjectId(p.id));

        participant = await Participant.findOne({refModel: 'Contact'})
            .where('_id')
            .in(participantIds)
            .exec();

        let ticket = new Ticket({
            subject: req.body.subject,
            issue: req.body.issue,
            department: req.body.department,
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

    });


};
