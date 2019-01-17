var Member = require('../models/member');
var Account = require('../models/account');
var Property = require('../models/property');
var Notification  = require('../models/notification');
const mailer = require('../mailer/index');


exports.liveChat = function (req, res, next) {

    res.render('administration/livechat',{
        PROTOCOL:process.env.PROTOCOL,
        HOST:process.env.HOST,
        PORT:process.env.PORT,
    });

};


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

exports.memberCreate = function (req, res) {

    function registerMembership(account){
        Member.create({
            role: 'Admin',
            status: 'Pending',
            account: account._id,
            property: req.params.pId,
        },function (err,member) {

            Notification.create({
                sender:req.user._id,
                receivers:[{
                    account:account._id,
                    read:false
                }],
                action:'INVITED',
                refModel:'Member',
                modelRef:member._id

            },function (err, notification) {
                let mailOptions = {
                    from: 'noreply@helpdesk.com',
                    to: account.email,
                    subject: `New property invite`,
                    // text: message['body'], // plain text body
                    // html: '<b>Hello world?</b>' // html body
                };

                let locals = {
                    link:`/membership/${member._id}/accept`,
                    property:member.property,
                    role:member.role
                };
                if (account.isNew){
                    locals.password = '12345'
                }
                mailer.sendTemplateNotification('invite.pug',locals,mailOptions,function (err, info) {
                    console.log('Message sent: %s', info.messageId);

                });
                res.redirect(`/p/${member.property}/s/members`);

            });


        });
    }

    Account.findOne({email:req.body.email},function (err, account) {
        if (!account){
            Account.register(new Account({
                //username: req.body.username,
                email: req.body.email
            }), '12345', function (err, account) {
                if (err) {
                    console.log(err)
                }
                registerMembership(account)
            });
        }else {
            registerMembership(account)
        }
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
