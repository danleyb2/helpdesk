var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ContactSchema = new Schema({
    email:      { type: String, required: true, unique: false }

}, {timestamps: true});


module.exports = mongoose.model('Contact', ContactSchema);
