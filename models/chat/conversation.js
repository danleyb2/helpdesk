var Message = require('./message');
var mongoose = require('mongoose');

var ConversationSchema = mongoose.Schema({

    title: {type: String},
    mail_notifications: {type: Boolean, default: false},
    property: {type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true},
    department: {type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true},
    status: {type: String, required: true, enum: ['Active', 'Ticketed', 'Stale'], default: 'Active'},
    type: {type: String, required: true, enum: ['EMAIL', 'SOCKET'], default: 'SOCKET'},
    participants: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Participant'}
    ]

}, {timestamps: true});

ConversationSchema.methods.isGroup = function () {
    return this.participants.length > 2;
};


ConversationSchema.methods.recentMessages = function (callback) {
    return Message.find({conversation: this._id})
        .sort('createdAt')
        //.populate('owner owner.profile')

        .populate({
            path: 'owner',
            populate: {
                path: 'modelRef',
            },
        })

        // .populate({
        //     path: 'owner',
        //     select: '_id username fullname image lastOnline'
        // })
        .exec(callback);
};


ConversationSchema.statics.findOrderByLastMessage = function (properties, callback) {
    return this.aggregate([
        {"$match": {"property": {$in: properties}}},
        {$lookup: {from: 'departments', localField: 'department', foreignField: '_id', as: 'department'}},
        {$lookup: {from: "messages", localField: "_id", foreignField: "conversation", as: "messages"}},
        {"$unwind": "$messages"},
        {"$sort": {"messages.createdAt": -1}},
        {
            "$group": {
                "_id": "$_id",
                "title": {"$first": "$title"},
                "department": {"$first": "$department.name"},
                "participants": {"$first": "$participants"},
                "property": {"$first": "$property"},
                "status": {"$first": "$status"},
                "latestMessage": {"$first": "$messages"}
            }
        },
        {"$sort": {"latestMessage.createdAt": -1}},

    ], callback);

};

module.exports = mongoose.model('Conversation', ConversationSchema);
