var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*

const TYPE_SITE = 0;
const TYPE_PAGE = 1;
*/

var PropertySchema = new Schema({
    name : {type:String,required: true},
    type: {type: String, required: true, enum:['Site', 'Page'], default:'Site'},
}, {timestamps: true});

module.exports = mongoose.model('Property', PropertySchema);
