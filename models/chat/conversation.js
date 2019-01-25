var Message = require('./message');
var mongoose = require('mongoose');

var ConversationSchema = mongoose.Schema({

    title: {type: String},
    mail_notifications: {type: Boolean, default: false},
    property: {type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true},
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


module.exports = mongoose.model('Conversation', ConversationSchema);
