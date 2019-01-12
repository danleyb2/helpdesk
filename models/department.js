var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DepartmentSchema = new Schema({
    name: {type: String, required: true },
    property:   { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },

},{timestamps: true});


module.exports = mongoose.model('Department', DepartmentSchema);
