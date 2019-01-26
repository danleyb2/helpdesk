var Ticket = require('./models/ticket');
var Notification = require('./models/notification');
var Conversation = require('./models/chat/conversation');

module.exports = {
    loadCommon,
    checkAuthentication
};

function loadCommon(req, res, next) {
    req.user.currentProperties(async function (properties) {
        console.log(properties);
        req.properties = properties;

        Object.assign(res.locals, {
            open_tickets_count: await Ticket.countDocuments({ "property": { $in: properties }}),
            active_conversations_count: await Conversation.countDocuments({ "property": { $in: properties },status:'Active'}),
            // open_tickets_count: Ticket.find(),
            unread_notifications: await Notification.countDocuments({"receivers.account": req.user._id,"receivers.read": false})

        });

        return next();

    });
}



// redirect middleware
function checkAuthentication(req, res, next) {
    res.locals.req = req;
    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (req.isAuthenticated()) {
        return next();
    }

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/login');
}
