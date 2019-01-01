
var mongoose = require('mongoose');

/*
var groupSchema = require('./group');
require('./tickettype');
var userSchema = require('./user');
var commentSchema = require('./comment');
var noteSchema = require('./note');
var attachmentSchema = require('./attachment');
var historySchema = require('./history');

require('./tag');
require('./ticketpriority');

*/

var Schema = mongoose.Schema;


var TicketSchema = Schema({

    // uid: {type: Number, unique: false, index: true},
    // owner: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'accounts'},
    // group: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'groups'},
    // assignee: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts'},
    /*
    deleted: {type: Boolean, default: false, required: true, index: true},
    type: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'tickettypes'},
    status: {type: Number, default: 0, required: true, index: true},
    priority: {type: mongoose.Schema.Types.ObjectId, ref: 'priorities', required: true},
    tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'tags'}],

    */
    property:   { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    contact:   { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },

    subject: {type: String, required: true},
    issue: {type: String, required: true},
    closedDate: {type: Date},

    // comments: [commentSchema],
    // notes: [noteSchema],
    // attachments: [attachmentSchema],
    // history: [historySchema],
    // subscribers: [{type: mongoose.Schema.Types.ObjectId, ref: 'accounts'}]


}, {timestamps: true});


module.exports = mongoose.model('Ticket', TicketSchema);
