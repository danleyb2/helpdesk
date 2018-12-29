var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MemberSchema = new Schema({
    role: {type: String, required: true, enum:['Admin', 'Agent'], default:'Agent'},
    status: {type: String, required: true, enum:['Enabled', 'Disabled'], default:'Enabled'}

},{timestamps: true});


module.exports = mongoose.model('Member', MemberSchema);
