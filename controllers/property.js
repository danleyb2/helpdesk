var Property = require('../models/property');
var Member = require('../models/member');


exports.createForm = function (req, res) {

    res.render('property/create', {})

};


exports.create = function (req, res,next) {

    let property = new Property({
        name: req.body.name,
        type: req.body.type,
        support_email: req.body.support_email
    });

    property.save(function (err) {
        if (err) {
            return next(err);
        }

        // create membership
        membership = new Member({
            role:'Admin',
            account:req.user._id,
            property:property._id,
        });

        membership.save(function (err,property) {
            res.redirect('/p')
        });
    })
};

exports.details = function (req, res) {
    Property.findById(req.params.pId, function (err, property) {
        if (err) return next(err);
        res.send(property);
    })
};
exports.update = function (req, res) {
    Property.findByIdAndUpdate(req.params.pId, {$set: req.body}, function (err, property) {
        if (err) return next(err);
        res.send('Product updated.');
    });
};

exports.delete = function (req, res) {
    Property.findByIdAndRemove(req.params.pId, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};

exports.list = function (req, res, next) {
    Property.find({}, 'name type')
        //.populate('author')
        .exec(function (err, properties) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.render('property/list', {title: 'Property List', 'properties': properties});
        });


};
