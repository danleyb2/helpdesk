var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MemberSchema = new Schema({
    role: {type: String, required: true, enum:['Admin', 'Agent'], default:'Agent'},
    status: {type: String, required: true, enum:['Pending', 'Enabled', 'Disabled'], default:'Pending'},
    account:   { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    property:   { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },


},{timestamps: true});

// assign a function to the "methods" object of our animalSchema
MemberSchema.methods.getFullName = function() {
    return this.account.username
};

module.exports = mongoose.model('Member', MemberSchema);
