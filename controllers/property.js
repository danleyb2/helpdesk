var Property = require('../models/property');


exports.createForm = function (req, res) {

    res.render('property/create', {})

};


exports.create = function (req, res,next) {

    let property = new Property({
        name: req.body.name,
        type: req.body.type
    });

    property.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/p')
    })
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
