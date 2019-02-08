var Property = require('../models/property');
var Member = require('../models/member');
var Priority = require('../models/ticket/priority');
var Type = require('../models/ticket/type');


exports.createForm = function (req, res) {

    res.render('property/create', {})

};


exports.create = function (req, res, next) {
    if (!req.user.isVerified) {
        return res
            .status(401)
            .send({type: 'not-verified', msg: 'Your account has not been verified.'});
    }

    let property = new Property({
        name: req.body.name,
        type: req.body.type,
        support_email: req.body.support_email
    });

    // const DEFAULT_TYPES = ['Issue', 'Task'];
    // const DEFAULT_PRIORITIES = ['Normal', 'Urgent', 'Critical'];

    property.save(async function (err) {
        if (err) {
            return next(err);
        }

        /*
        // create default ticket types
        let types = DEFAULT_TYPES.map(function (type) {
            return {
                name: type,
                property: property
            }
        });
        await Type.insertMany(types);
        // create default ticket priorities
        let priorities = DEFAULT_PRIORITIES.map(function (priority) {
            return {
                name: priority,
                property: property
            }
        });
        await Priority.insertMany(priorities);
        */

        // create membership
        let membership = new Member({
            role: 'Admin',
            status: 'Enabled',
            account: req.user._id,
            property: property._id,
        });
        await membership.save();
        res.redirect('/p')

    });

};

exports.details = function (req, res) {
    Property.findById(req.params.pId, function (err, property) {
        if (err) return next(err);
        res.render('property/detail',{'property':property});
    })
};
exports.update = function (req, res) {
    Property.findByIdAndUpdate(req.params.pId, {$set: req.body}, function (err, property) {
        if (err) return next(err);
        res.redirect(`/p/${property._id}`);
    });
};

exports.delete = function (req, res) {
    Property.findByIdAndRemove(req.params.pId, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};

exports.list = function (req, res, next) {

    Member.find({
            account: req.user._id
        })
        .populate({
            path: 'property',
        })
        .exec(function (err, memberships) {
            res.render('property/list', {title: 'Memberships', 'memberships': memberships});
        });

};
