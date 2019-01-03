var Ticket = require('../../models/ticket');
// var Member = require('../models/member');
const Property = require('../../models/property');
const Contact = require('../../models/contact');
const Participant = require('../../models/chat/participant');
const Conversation = require('../../models/chat/conversation');

exports.create = async function (req, res,next) {
    console.log(req.body);

    var property = await Property.findOne({support_email: req.body.to});

    if(property==null){
        return next(new Error('SHOULD NOT HAPPEN'))
    }

    var contact = await Contact.findOne({email: req.body.contact_email, property: property._id});
    if (contact == null) {

        contact = await Contact.create({
            name: req.body.contact_name,
            email: req.body.contact_email,
            property: property._id
        });
    }


    // create participant
    var participant = await Participant.create({
        refModel: 'Contact',
        modelRef: contact._id
    });


    var conversation = await Conversation.create({
        title: req.body.subject,
        property: property._id,
        mail:true,
        participants: [participant._id]
    });


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
        property: property._id,
        conversation: conversation._id,
        contact: participant.modelRef,
    });

    ticket.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send(ticket)
    })

};
