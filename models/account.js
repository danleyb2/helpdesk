var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
const Member = require('./member');

var Account = new Schema({
    active: Boolean,
    name: {type: String},
    email: {type: String, required: true, unique: true},
    username: {
        type: String,
        trim: true,
        index: {
            unique: true,
            partialFilterExpression: {username: {$type: 'string'}}
        },
        required: false
    },
    isVerified: { type: Boolean, default: false },
}, {timestamps: true});

/*

, {
    // Set usernameUnique to false to avoid a mongodb index on the username column!
    usernameUnique: false,

    findByUsername: function (model, queryParameters) {
        // Add additional query parameter - AND condition - active: true
        queryParameters.active = true;
        return model.findOne(queryParameters);
    }
}

* */

Account.plugin(passportLocalMongoose, {
    usernameLowerCase: true,
    usernameQueryFields: ['username'],
    usernameField:'email'

});


Account.methods.currentProperties = function (cb) {

    Member.find({account:this._id,'status':'Enabled'},function (err,memberships) {
        let properties = memberships.map(function (membership) {
            return membership.property;
        });

        cb(properties);

    });

};


module.exports = mongoose.model('Account', Account);

