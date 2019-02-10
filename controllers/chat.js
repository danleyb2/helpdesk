var Property = require('../models/property');
var Department = require('../models/department');

exports.details = function (req, res) {
   // console.log(req.sessionID);

    Property.findById(req.params.pId, function (err, property) {
        if (err) return next(err);

        Department.find({property: property._id},function (err, departments) {

            res.render('chat', { title: 'Chat',property : property,'departments':departments });

        });

    });
};
