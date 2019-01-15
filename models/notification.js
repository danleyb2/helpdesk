var mongoose = require('mongoose');
var Schema = mongoose.Schema;


NotificationSchema = new Schema({
    sender: {type:mongoose.Schema.Types.ObjectId, ref:'Account'}, // Notification creator
    receivers: [
        new mongoose.Schema({
            account: {type:mongoose.Schema.Types.ObjectId, ref:'Account'},
            read: {type: Boolean},
            deleted: {type: Boolean,default:false}
        }, {_id: false, timestamps: true})
    ], // Receivers of the notification
    action: String,
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
        enum: ['Ticket', 'Member']
    }

},{timestamps: true});


module.exports = mongoose.model('Notification', NotificationSchema);
