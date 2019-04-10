var Ticket = require('../models/ticket');
const Contact = require('../models/contact');
const Property = require('../models/property');
const Participant = require('../models/chat/participant');
const Conversation = require('../models/chat/conversation');



exports.createForm = async function (req, res) {

    var properties = await Property.find({
        '_id': { $in: req.properties}
    });

    res.render('ticket/create', {properties:properties})

};


exports.create = async function (req, res, next) {
    if (!req.user.isVerified) {
        return res
            .status(401)
            .send({type: 'not-verified', msg: 'Your account has not been verified.'});
    }

    var contact = await Contact.findOne({email: req.body.contact_email, property: req.body.property});
    if (contact == null) {

        contact = await Contact.create({
            name: req.body.contact_name,
            email: req.body.contact_email,
            property: req.body.property,
        });
    }


    // create participant
    var participant = await Participant.create({
        refModel: 'Contact',
        modelRef: contact._id
    });


    var conversation = await Conversation.create({
        title: req.body.subject,
        property: req.body.property,
        participants: [participant._id],
        status:'Ticketed'
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
        property: req.body.property,
        conversation: conversation._id,
        contact: participant.modelRef,
    });

    ticket.save(function (err) {
        if (err) {
            return next(err);
        }
        // res.redirect('/p/' + req.body.property + '/t')
        res.redirect('/t/')
    })

};

exports.details = function (req, res, next) {
    Ticket.findOne({_id: req.params.tId}).populate('conversation').exec(function (err, ticket) {
        if (err) return next(err);

        ticket.conversation.recentMessages(function (err, messages) {
            res.render('ticket/detail', {
                'ticket': ticket,
                'messages': messages

            });

        });

    })
};


exports.update = function (req, res,next) {

    Ticket.findByIdAndUpdate(req.params.tId, {$set: req.body}, function (err, ticket) {
        if (err) return next(err);

        res.send(ticket);

    });


};

exports.delete = function (req, res) {
    Property.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};

exports.list = function (req, res, next) {
    Ticket.find({"property": { $in: req.properties }})
        .populate('contact')
        .exec(function (err, tickets) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.render('ticket/list', {title: 'Tickets', 'tickets': tickets});
        });


};
