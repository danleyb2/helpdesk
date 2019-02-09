var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DepartmentSchema = new Schema({
    name: {type: String, required: true },
    property:   { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    support_email:{ type: String, required: true, unique: true },
    members: [
        new mongoose.Schema({
            membership: {type:mongoose.Schema.Types.ObjectId, ref:'Member'},
            role: String
            /*
            read: {type: Boolean},
            deleted: {type: Boolean,default:false}
            */
        }, {_id: false, timestamps: true})
    ],

},{timestamps: true});


module.exports = mongoose.model('Department', DepartmentSchema);
