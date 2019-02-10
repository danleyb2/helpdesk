var Property = require('../models/property');
var Member = require('../models/member');
var Department = require('../models/department');
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
        description: req.body.description||undefined,
        type: req.body.type,
        owner: req.user._id

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
            property: property._id
        });
        await membership.save(); // todo make async

        Department.create({
            name:'general',
            property: property._id,
            support_email: req.body.support_email||undefined,
            members:[{
                membership:membership._id,
                role:'owner'
            }]

        },function (err, department) {
            if (err)return next(err);
            res.redirect('/p')
        });

    });

};

exports.details = async function (req, res) {
    // const doc = await Band.findOne({ name: 'Motley Crue' }).

   const property = await Property.findById(req.params.pId).populate('numMembers');


    res.render('property/detail',{'property':property});

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
            populate: {
                path: 'numMembers',
            },
        })
        .exec(function (err, memberships) {
            res.render('property/list', {title: 'Memberships', 'memberships': memberships});
        });

};
