const Conversation = require('./models/chat/conversation');
const Message = require('./models/chat/message');
const Participant = require('./models/chat/participant');
const Contact = require('./models/contact');
const async = require('async');

module.exports = function (io) {

    io.on("connection", function (socket) {
            console.log("new connection");

            socket.on('new message', function (msg) {
                console.log('new message: ' + msg);

                var conversation;
                var participant;

                // validate conversation
                if (msg['conversation']) {

                    async.waterfall([
                        function (msg) {
                            return function (callback) {
                                conversation = Conversation.findOne({_id: msg['conversation']});
                                callback(null, conversation);
                            }

                        },
                        function (conversation, callback) {
                            return function (callback) {
                                participant = Participant.findOne({_id: conversation.participants[0]});
                                callback(err, participant);


                            }
                        }
                    ], function (error, success) {
                        if (error) {
                            alert('Something is wrong!');
                        }
                        return alert('Done!');
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

                                    if (err){
                                        console.error(err)
                                    }


                                    msg['conversation'] = conversation._id;
                                    return callback(null, conversation,participant);


                                });


                            }

                        ], function (error, conversation,participant) {
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
