var Ticket = require('../models/ticket');
const Contact = require('../models/contact');
const Participant = require('../models/chat/participant');
const Conversation = require('../models/chat/conversation');


const async  = require('async');


exports.createForm = function (req, res) {

    res.render('ticket/create', {})

};


exports.create = function (req, res,next) {

    async.waterfall([
            function (callback) {
                Contact.create({
                    name:req.body.contact_name,
                    email:req.body.contact_email,
                    property:req.params.pId,
                }, function (err, contact) {
                    return callback(null, contact);
                });
            },
            function (contact, callback) {
                // create participant
                Participant.create({
                    refModel: 'Contact',
                    modelRef: contact._id
                }, function (err, participant) {
                    return callback(null, participant);
                });

            },
            function (participant, callback) {
                Conversation.create({
                    title: req.body.subject,
                    property:req.params.pId,
                    participants: [participant._id]
                }, function (err, conversation) {
                    if (err) {
                        callback(err)
                    }

                    // msg['conversation'] = conversation._id;
                    return callback(null, conversation, participant);

                });


            }

        ], function (error, conversation, participant) {
            if (error) {
                next(error)
            }
            /* todo should make the subject the first message?
            var message = Message.create({
                body: msg['text'],
                conversation: conversation._id,
                owner: participant._id,
            }, function (err, message) {
                if (err) console.error(err);
                // saved!

                msg['_id'] = message._id;
                io.emit('chat message', msg);


            });
            */

        let ticket = new Ticket({
            subject: req.body.subject,
            issue: req.body.issue,
            property:req.params.pId,
            conversation: conversation._id,
            contact:participant.modelRef,
        });

        ticket.save(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/p/'+req.params.pId+'/t')
        })


        }
    );

};

exports.details = function (req, res) {
    Ticket.findOne({_id:req.params.tId}).
    populate('conversation').
    exec(function (err, ticket) {
        if (err) return next(err);

            ticket.conversation.recentMessages(function (err,messages) {
                res.render('ticket/detail',{
                    'ticket':ticket,
                    'messages': messages

                });

            });

    })
};
exports.update = function (req, res) {
    Property.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, property) {
        if (err) return next(err);
        res.send('Product updated.');
    });
};

exports.delete = function (req, res) {
    Property.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};

exports.list = function (req, res, next) {
    Ticket.find({})
        .populate('contact')
        .exec(function (err, tickets) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.render('ticket/list', {title: 'Ticket List', 'tickets': tickets});
        });


};
