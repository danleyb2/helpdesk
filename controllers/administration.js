var Member = require('../models/member');
var Property = require('../models/property');


exports.index = function (req, res, next) {

    res.render('administration/general');

};
exports.members = function (req, res) {

    Member.find({})
        .populate('account')
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
