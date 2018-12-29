var mongoose = require('mongoose');

var ConversationSchema = mongoose.Schema({

    title: {type: String},

    participants: [

        {type: mongoose.Schema.Types.ObjectId, ref: 'Participant'}

    ]

},
    {
        timestamps: true
    });

ConversationSchema.methods.isGroup = function () {
    return this.participants.length > 2;
};

module.exports = mongoose.model('Conversation', ConversationSchema);
