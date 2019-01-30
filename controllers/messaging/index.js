var Conversation = require('../../models/chat/conversation');

exports.list = function (req, res) {

    //console.log(req.properties);
    Conversation.find({"property": { $in: req.properties }})
        .sort('-createdAt') // todo should be last message or updated at
        .exec(function (err, conversations) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.render('messaging/conversations', {title: 'Conversations', 'conversations': conversations});
        });


};


exports.details = function (req, res) {

    Conversation.find({"property": { $in: req.properties }})
        .sort('-createdAt') // todo should be last message or updated at
        .exec(function (err, conversations) {
            if (err) {
                return next(err);
            }
            if (req.params.id){
                Conversation.findById(req.params.id, function (err, conversation) {
                    if (err) return next(err);
                    conversation.recentMessages(function (err,messages) {
                        res.render('messaging/conversations', {
                            title: 'Conversation',
                            'conversations': conversations,
                            'currentConversation': conversation,
                            'messages': messages
                        });

                    });
                });

            }else {
                res.render('messaging/conversations', {
                    title: 'Conversation',
                    'conversations': conversations,
                    'currentConversation': undefined,
                    'messages': []
                });

            }

        });



};
