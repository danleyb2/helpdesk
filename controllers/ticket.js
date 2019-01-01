var Ticket = require('../models/ticket');
const Contact = require('../models/contact');


exports.createForm = function (req, res) {

    res.render('ticket/create', {})

};


exports.create = function (req, res,next) {
    // create membership
    contact = new Contact({
        name:req.body.contact_name,
        email:req.body.contact_email,
        property:req.params.pId,
    });

    contact.save(function (err,newContact) {

        if (err){
            return next(err);
        }

        let ticket = new Ticket({
            subject: req.body.subject,
            issue: req.body.issue,
            property:req.params.pId,
            contact:newContact._id,
        });

        ticket.save(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/p/'+req.params.pId+'/t')
        })
    });

};

exports.details = function (req, res) {
    Property.findById(req.params.id, function (err, property) {
        if (err) return next(err);
        res.send(property);
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
        .exec(function (err, tickets) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.render('ticket/list', {title: 'Ticket List', 'tickets': tickets});
        });


};
