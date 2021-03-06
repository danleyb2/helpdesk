var Ticket = require('../../models/ticket');
// var Member = require('../models/member');
const Property = require('../../models/property');
const Department = require('../../models/department');
const Contact = require('../../models/contact');
const Participant = require('../../models/chat/participant');
const Conversation = require('../../models/chat/conversation');
const Message = require('../../models/chat/message');
var mongoose = require('mongoose');


/**
 * Extract name and email from this format
 *
 * 'Brian Nyaundi <danleyb2@gmail.com>\n'
 * 'danleyb2@gmail.com\n'
 *
 *
 * @param full_email
 * @returns {*[]} Name and Email, name can be undefined
 */
function extractNameEmail(full_email) {
    let email_trimmed = full_email.replace('\\n','').trim();
    const s = email_trimmed.indexOf('<');
    let email, name;
    if (s > -1) {
        name = email_trimmed.substr(0, s).trim();
        email = email_trimmed.slice(s + 1, email_trimmed.length - 1);
    } else {
        email = email_trimmed;
    }
    return [name, email]
}


exports.receive = async function (req, res,next) {
    console.log(req.body);

    var endpoint = extractNameEmail(req.body.to)[1];
    const NOTIFICATIONS = 'notifications-';
    var conversation;

    if(endpoint.indexOf(NOTIFICATIONS)>-1){

        var conversationId = endpoint.substring(endpoint.indexOf(NOTIFICATIONS)+NOTIFICATIONS.length,endpoint.indexOf('@'))
        conversation = await Conversation.findOne({_id: conversationId}).exec();;
        let participantIds = conversation.participants.map(p => new mongoose.Types.ObjectId(p.id));
        participant = await Participant.findOne({refModel: 'Contact'})
            .where('_id')
            .in(participantIds)
            .exec();

        var message = await Message.create({
            body: req.body.message,
            conversation: conversation._id,
            owner: participant._id,
        });

        res.send(message)

    }else {


        var contactNameEmail = extractNameEmail(req.body.from);

        var department = await Department.findOne({support_email: endpoint});

        if (department == null) {
            return next(new Error('SHOULD NOT HAPPEN'))
        }

        // var property = await Property.findOne({support_email: endpoint});

        var contact = await Contact.findOne({email: contactNameEmail[1], property: department.property});
        if (contact == null) {

            contact = await Contact.create({
                name: contactNameEmail[0] || '',
                email: contactNameEmail[1],
                property: department.property
            });
        }

        // create participant
        var participant = await Participant.create({
            refModel: 'Contact',
            modelRef: contact._id
        });

        Conversation.create({
            title: req.body.subject.trim(),
            property: department.property,
            department: department._id,
            mail_notifications: true,
            type:'SOCKET',
            participants: [participant._id]
        },function(err,conversation){
            if (err) {
                return next(err);
            }

            Message.create({
                body: req.body.message,
                conversation: conversation._id,
                owner: participant._id,
            }, function (err, message) {
                if (err) return next(err);

                res.send(message);

            });
        });

        /*
        let ticket = new Ticket({
            subject: req.body.subject,
            issue: req.body.message,
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
        */
    }

};
