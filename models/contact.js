var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ContactSchema = new Schema({
    name:      { type: String },
    email:      { type: String, required: true, unique: true },
    property:   { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },

}, {timestamps: true});


module.exports = mongoose.model('Contact', ContactSchema);
