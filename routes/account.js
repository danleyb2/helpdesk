var express = require('express');
var Account = require('../models/account');
var Token = require('../models/account/token');
var passport = require('passport');
const accountController = require('../controllers/account');
const mailer = require('../mailer/index');
const crypto = require('crypto');

var router = express.Router();

/* GET home page. */
router.get('/register', function (req, res, next) {

    res.render('register', {title: 'Register'});
});

router.post('/register', function (req, res, next) {

    // todo Make sure this account doesn't already exist
    //   User.findOne({ email: req.body.email }, function (err, user) {
    //
    //     // Make sure user doesn't already exist
    //     if (user) return res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' });
    //

    Account.register(new Account({
        username: req.body.username,
        email: req.body.email
    }), req.body.password, function (err, account) {
        if (err) {
            return res.render('register', {error: err.message});
        }

        passport.authenticate('local')(req, res, function () {
            // res.redirect('/');
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });

        });


    });
});

router.get('/verify_email', async function (req, res, next) {
    if (req.user.isVerified) {
        return res.status(400).send({
            type: 'already-verified',
            msg: 'This user has already been verified.'
        });
    }

    function sendEmail(token){
        // Send the email
        var mailOptions = {
            from: 'noreply@danleyb2.online',
            to: req.user.email,
            subject: 'Account Verification Token',
            text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + process.env.HOST + '\/confirmation\/' + token.token + '.\n'
        };
        mailer.sendNotification(mailOptions,function (err,info) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            console.log('Message sent: %s', info.messageId);

        });

    }

    let token = await Token.findOne({account: req.user._id});
    if (!token){
        // Create a verification token for this user
        Token.create({
            account: req.user._id,
            token: crypto.randomBytes(16).toString('hex')

        },function (err, token) {
            if (err){
                console.trace(err);
            }
            sendEmail(token);
        });

    }else {
        // todo update expiry if will be soon
        sendEmail(token);

    }

    res.render('account/verify_email', {user:req.user});


});

router.get('/password_reset', function (req, res) {
    res.render('forgot_password_form', {title:'Forgot Password'});
});


router.get('/password_reset/done/', function (req, res) {
    res.render('forgot_password_done', {title:'Forgot Password'});
});

router.post('/password_reset', function (req, res,next) {

    function sendEmail(token,account){
        // Send the email
        var mailOptions = {
            from: 'no-reply@helpdesk.com',
            to: account.email,
            subject: 'Reset Password',
            text: 'Hello,\n\n' + 'Please reset your HelpDesk account password by clicking the link: \nhttp:\/\/' + req.headers.host + '\/reset_password\/' + token.token + '.\n'
        };
        mailer.sendNotification(mailOptions,function (err,info) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            console.log('Message sent: %s', info.messageId);
        });
    }

    Account.findOne({'email':req.body.email},function (err, account) {
        if (err) {
            return next(err);
        }
        if (account) {
            Token.findOne({account: account._id},function (err, token) {
                if (!token) {
                    // Create a verification token for this user
                    Token.create({
                        account: account._id,
                        token: crypto.randomBytes(16).toString('hex')

                    }, function (err, token) {
                        if (err) {
                           return next(err);
                        }
                        sendEmail(token,account);
                    });

                } else {
                    // todo update expiry if will be soon
                    sendEmail(token,account);
                }
            });

        }

    });

    res.redirect('/password_reset/done/');
});
router.get('/reset_password/:token', accountController.resetPasswordGet);
router.post('/reset_password/:token', accountController.resetPasswordDone);

router.get('/login', function (req, res) {
    res.render('login', {});
});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
       // badRequestMessage: 'Missing username or password.',
    } , function (error, account, info) {
        if (account) {
            // todo Make sure the user has been verified
            /*
            if (!account.isVerified) {
                return res
                    .status(401)
                    .send({type: 'not-verified', msg: 'Your account has not been verified.'});
            }
            */

            req.logIn(account, {}, function(err) {
                if (err) { return next(err); }
                res.redirect('/')
            });
        } else {
            res.render('login', {info: info});
        }

    })(req, res, next);
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/confirmation/:token', accountController.confirmationPost);
router.post('/resend', accountController.resendTokenPost);


module.exports = router;
