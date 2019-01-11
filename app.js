var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
// todo var winston = require('./config/winston');
var io = require("socket.io")();


var mongoose = require('mongoose');
var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


var apiRouter = require('./routes/api/mail');
var accountRouter = require('./routes/account');
var indexRouter = require('./routes/index');
var chatRouter = require('./routes/chat');
var propertyRouter = require('./routes/property');
var messagingRouter = require('./routes/messaging/general');
var ticketsRouter = require('./routes/ticket');

var usersRouter = require('./routes/users');

var app = express();
app.io = io;

// mongoose
mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`, {
    useCreateIndex: true,
    useNewUrlParser: true
});

/* todo upgrade to this
let dev_db_url = 'mongodb://someuser:abcd1234@ds123619.mlab.com:23619/productstutorial';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
*/

// end mongoose

var sessionSecret = 'helpdesk$123#SessionKeY!2387';
sessionStore = new MongoStore({mongooseConnection: mongoose.connection, autoReconnect: true});

var cookie = {
    httpOnly: true,
    maxAge: (1000 * 60 * 60 * 24) * 365 // 1 year
};

var sessionMiddleware = session({
    secret: sessionSecret,
    cookie: cookie,
    store: sessionStore,
    saveUninitialized: false,
    resave: false
});

io.use(function (socket, next) {
    // Wrap the express middleware
    sessionMiddleware(socket.request, {}, next);
});

// socket.io events
var socket = require('./socket')(app.io);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
// todo app.use(logger('dev', { stream: winston.stream }));

app.use(express.json());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cookieParser());



app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));


app.use('/chat', chatRouter);

app.use('/api/mail', apiRouter);
app.use('/', accountRouter);

// redirect middleware
function checkAuthentication(req, res, next) {
    res.locals.req = req;
    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (req.isAuthenticated())
        return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/login');
}

function loadCommon(req, res, next) {
    res.locals = {
        siteTitle: "My Website's Title",
        pageTitle: "The Home Page",
        author: "Cory Gross",
        description: "My app's description",
    };
   return next();
}

app.use('/', checkAuthentication, indexRouter);
app.use('/p', checkAuthentication, propertyRouter);
app.use('/m', checkAuthentication, messagingRouter);
app.use('/t', checkAuthentication, ticketsRouter);

// app.use('/dashboard', usersRouter);

// passport config
var Account = require('./models/account');

passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};


    // add this line to include winston logging
    // todo winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);


    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
