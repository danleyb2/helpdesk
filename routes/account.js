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

    let token = await Token.find({account: req.user._id});
    if (!token){
        // Create a verification token for this user
        token = await Token.create({ account: req.user._id, token: crypto.randomBytes(16).toString('hex') });

        // Send the email
        var mailOptions = {
            from: 'no-reply@helpdesk.com',
            to: req.user.email,
            subject: 'Account Verification Token',
            text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n'
        };
        mailer.sendNotification(mailOptions,function (err,info) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            console.log('Message sent: %s', info.messageId);

        });

    }else {
        // todo update expiry if will be soon

    }

    res.render('account/verify_email', {user:req.user});


});

router.get('/forgot_password', function (req, res) {
    res.send('TODO');
});

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
