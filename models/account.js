var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Account = new Schema({
    active: Boolean,
    name:      { type: String },
    email:      { type: String, required: true, unique: true },

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

Account.plugin(passportLocalMongoose,{
    usernameLowerCase:true,
    usernameQueryFields:['email']

});

module.exports = mongoose.model('Account', Account);

