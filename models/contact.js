var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ContactSchema = new Schema({
    name:      { type: String },
    email:      { type: String, required: true, unique: true },
    property:   { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },

}, {timestamps: true});


// assign a function to the "methods" object of our animalSchema
ContactSchema.methods.getFullName = function() {
    return this.name
};

module.exports = mongoose.model('Contact', ContactSchema);
