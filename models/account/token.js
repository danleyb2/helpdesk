
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TokenSchema = new Schema({
    account: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Account' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

module.exports = mongoose.model('Token', TokenSchema);
