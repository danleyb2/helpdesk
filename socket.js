const Conversation = require('./models/chat/conversation');
const Account = require('./models/account');
const Member = require('./models/member');
const Message = require('./models/chat/message');
const Participant = require('./models/chat/participant');
const Contact = require('./models/contact');
const Property = require('./models/property');
const Department = require('./models/department');

const mailer = require('./mailer/index');
//const async = require('async');
var mongoose = require('mongoose');


module.exports = function (io) {

    var clients = [];


    // nsp.emit('hi', 'everyone!');
    io.on("connection", async function (socket) {

        clients.push(socket.id);

        // console.log("new connection");
        var sessionId = socket.request.sessionID;
        //console.log(sessionId);
        // todo use above
        if (socket.request.session.passport) {
            var userId = socket.request.session.passport.user;
            //console.log("Your User ID is", userId);
            user = await Account.findOne({email: userId});
            socket.user = user;

            // todo save socket and user_id

        }

        // console.log(socket.user);

        socket.on('new message', async function (msg) {
            // console.log('new message: ' + msg);

            var conversation;
            var participant;
            var property;
            var department;

            conversation = await Conversation.findOne({_id: msg['conversation']});
            department = await Department.findOne({_id: conversation.department});
            property = await Property.findOne({_id: conversation.property});

            let participantIds = conversation.participants.map(p => new mongoose.Types.ObjectId(p.id));

            if (socket.user){
                var member = await Member.findOne({account: socket.user._id});

                participant = await Participant.findOne({modelRef: mongoose.Types.ObjectId(member._id)})
                    .where('_id')
                    .in(participantIds)
                    .exec();

                if (participant == null) {
                    participant = await Participant.create({
                        refModel: 'Member',
                        modelRef: member._id
                    });

                    conversation.participants.push(participant);
                    await conversation.save();
                    //
                    // await Conversation.updateOne(
                    //     { _id: conversation._id },
                    //     { $push: { participants: participant } }
                    // );

                }

            } else {

                participant = await Participant.findOne({refModel: 'Contact'})
                    .where('_id')
                    .in(participantIds)
                    .exec();


            }

            var message = await Message.create({
                body: msg['text'],
                conversation: conversation._id,
                owner: participant._id,
            });

            if (conversation.mail_notifications) {

                var contact = await Participant.findOne({refModel: 'Contact'})
                    .where('_id')
                    .in(participantIds)
                    .populate('modelRef')
                    .exec();


                let mailOptions = {
                    from: department.support_email, // sender address
                    to: contact['modelRef']['email'], // list of receivers
                    replyTo: 'notifications-' + conversation._id + '@'+process.env.MAIL_SERVER_HOST,
                    subject: `Re: ${conversation.title}`, // Subject line
                    text: message['body'], // plain text body
                    // html: '<b>Hello world?</b>' // html body
                };
                mailer.sendNotification(mailOptions,function (err, info) {
                    console.log('Message sent: %s', info.messageId);

                });
            }

            message['owner'] = participant;
            var room = 'c/' + conversation._id;
            // console.log(io.sockets.adapter.rooms[room]);

            io.sockets.in(room).emit('chat message', message);


        });
        socket.on('init chat', async function (msg) {
            var conversation;

            conversation = await Conversation.findOne({_id: msg['conversation']}).populate('participants').exec();
            if (conversation == null) {
                console.trace('SHOULD NOT HAPPEN')

            } else {
                conversation.recentMessages(function (err, messages) {
                    msg['participants'] = conversation['participants'];
                    msg['messages'] = messages;
                    var room = 'c/' + conversation._id;
                    socket.join(room);
                    //io.sockets.in(room).emit('init chat', msg);
                    //io.to(
                    socket.emit('init chat', msg);
                });
            }
        });
        socket.on('start chat', async function (msg) {
            var conversation;
            var participant;


            var contact = await Contact.findOne({email: msg['email'], property: msg['property']});
            if (contact == null) {
                contact = await Contact.create({
                    name: msg['name'],
                    email: msg['email'],
                    property: msg['property']
                });
            }

            // create participant
            participant = await Participant.create({
                refModel: 'Contact',
                modelRef: contact._id
            });


            conversation = await Conversation.create({
                title: msg['text'],
                participants: [participant._id],
                department: msg['department'],
                property: msg['property']
            });
            msg['conversation'] = conversation._id;

            // msg['participant'] = contact._id;
            var message = await Message.create({
                body: msg['text'],
                conversation: conversation._id,
                owner: participant._id,
            });
            msg['_id'] = message._id;
            var room = 'c/' + conversation._id;
            socket.join(room);
            //io.to(
            socket.emit('start chat', msg);

        });


    });

    return io;
};
