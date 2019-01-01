var Member = require('../models/member');


exports.list = function (req, res) {

    Member.find({})
        .exec(function (err, members) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.render('administration/member/list', {title: 'Members', 'members': members});
        });


};


exports.details = function (req, res) {
    Conversation.findById(req.params.id, function (err, conversation) {
        if (err) return next(err);

        conversation.recentMessages(function (err,messages) {

            res.render('messaging/detail', {
                title: 'Conversation',
                'conversation': conversation,
                'messages': messages
            });

        });


    })
};
