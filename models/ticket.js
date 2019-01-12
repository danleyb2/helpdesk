
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

    assignee: {type: mongoose.Schema.Types.ObjectId, ref: 'Member',required:false},
    status: {type: String, required: true, enum:['Open', 'Closed'], default:'Open'},
    priority: {type: mongoose.Schema.Types.ObjectId, ref: 'Priority', required: true},
    type: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Type'},
    /*
    deleted: {type: Boolean, default: false, required: true, index: true},
    tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'tags'}],
    */
    department:   { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: false },
    property:   { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    contact:   { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
    conversation:   { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },

    subject: {type: String, required: true},
    issue: {type: String, required: true},
    closedDate: {type: Date},

    // notes: [noteSchema],
    // attachments: [attachmentSchema],
    // history: [historySchema],
    // subscribers: [{type: mongoose.Schema.Types.ObjectId, ref: 'accounts'}]

}, {timestamps: true});


module.exports = mongoose.model('Ticket', TicketSchema);
