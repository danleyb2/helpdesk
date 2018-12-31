const Conversation = require('./models/chat/conversation');
const Account = require('./models/account');
const Message = require('./models/chat/message');
const Participant = require('./models/chat/participant');
const Contact = require('./models/contact');
const async = require('async');
var mongoose = require('mongoose');


module.exports = function (io) {

    io.on("connection", function (socket) {
            console.log("new connection");
            var userId;
            if (socket.request.session.passport.user) {
                userId = socket.request.session.passport.user;
                console.log("Your User ID is", userId);
                Account.findOne({username: userId}, function (err, user) {
                    socket.user = user;
                    // todo might be null

                });

            }

            socket.on('new message', function (msg) {
                console.log('new message: ' + msg);

                var conversation;
                var participant;

                // validate conversation
                if (msg['conversation']) {
                    async.waterfall([
                        function (callback) {
                            conversation = Conversation.findOne({_id: msg['conversation']}, function (err, conversation) {
                                callback(null, conversation);
                            });
                        },
                        function (conversation, callback) {

                            let arr = conversation.participants.map(ele => new mongoose.Types.ObjectId(ele.id));

                            // find participant
                            Participant.findOne({ modelRef: mongoose.Types.ObjectId(socket.user._id)})
                                .where('_id')
                                .in(arr)
                                .exec(function (err, participant) {

                                console.log(participant);

                                // create participant
                                if (participant==null) {

                                    Participant.create({
                                        refModel: 'Member',
                                        modelRef: socket.user._id
                                    }, function (err, newParticipant) {
                                        return callback(null, conversation,newParticipant);
                                    });

                                }else {
                                    return callback(null,conversation, participant);
                                }

                            });

                        }
                    ], function (error, conversation,participant) {
                        if (error) {
                            console.log(error);
                        }

                        var message = Message.create({
                            body: msg['text'],
                            conversation: conversation._id,
                            owner: participant._id,

                        }, function (err, message) {
                            if (err) console.error(err);
                            // saved!

                            msg['_id'] = message._id;
                            io.emit('chat message', message);
                        });

                    });


                } else {
                    async.waterfall([
                            function (callback) {
                                var contact = Contact.create({email: 'danleyb2@gmail.com'}, function (err, contact) {
                                    return callback(null, contact);
                                });
                            },
                            function (contact, callback) {

                                // create participant
                                participant = Participant.create({
                                    refModel: 'Contact',
                                    modelRef: contact._id
                                }, function (err, participant) {
                                    return callback(null, participant);
                                });

                            },
                            function (participant, callback) {

                                Conversation.create({
                                    title: msg['conversationId'],
                                    participants: [participant._id]
                                }, function (err, conversation) {

                                    if (err) {
                                        console.error(err)
                                    }


                                    msg['conversation'] = conversation._id;
                                    return callback(null, conversation, participant);


                                });


                            }

                        ], function (error, conversation, participant) {
                            if (error) {
                                console.error(error)
                            }
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
                        }
                    );

                }
            });

        }
    )
    ;


    return io;
}
;
