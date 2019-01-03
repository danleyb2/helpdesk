var Property = require('../models/property');

exports.details = function (req, res) {
   // console.log(req.sessionID);

    Property.findById(req.params.pId, function (err, property) {
        if (err) return next(err);

        res.render('chat', { title: 'Chat',property : property });

    });
};
