var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ParticipantSchema = Schema({
        modelRef: {
            type: Schema.Types.ObjectId,
            required: true,
            // Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
            // will look at the `refModel` property to find the right model.
            refPath: 'refModel'
        },
        refModel: {
            type: String,
            required: true,
            enum: ['Contact', 'Member']
        },


        // hasUnread: {type: Boolean},
        // lastRead: {type: Date},
        // deletedAt: {type: Date}
    }, {timestamps: true}
);


module.exports = mongoose.model('Participant', ParticipantSchema);
