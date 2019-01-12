var mongoose = require('mongoose');

const DEFAULT_PRIORITIES = ['Normal','Urgent','Critical'];

var PrioritySchema = mongoose.Schema({
    property:   { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    name: {type: String, required: true},

}, {toJSON: {virtuals: true}});

PrioritySchema.pre('save', function (next) {
    this.name = this.name.trim();
    return next();
}, {timestamps: true});

module.exports = mongoose.model('priority', PrioritySchema);
