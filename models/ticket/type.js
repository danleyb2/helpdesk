var mongoose = require('mongoose');




var TypeSchema = mongoose.Schema({
    property:   { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    name:       { type: String, required: true, unique: false }

}, {timestamps: true});


module.exports = mongoose.model('Type', TypeSchema);
