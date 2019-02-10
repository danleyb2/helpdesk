var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*

const TYPE_SITE = 0;
const TYPE_PAGE = 1;
*/

var PropertySchema = new Schema({
    name : {type:String,required: true},
    description : {type:String,required: false},
    type: {type: String, required: true, enum:['Site', 'Page'], default:'Site'},
    owner:   { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }

}, {timestamps: true});


PropertySchema.virtual('numMembers', {
    ref: 'Member', // The model to use
    localField: '_id', // Find Members where `localField`
    foreignField: 'property', // is equal to `foreignField`
    count: true // And only get the number of docs
});


module.exports = mongoose.model('Property', PropertySchema);
