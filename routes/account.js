var express = require('express');
var Account = require('../models/account');
var passport = require('passport');

var router = express.Router();

/* GET home page. */
router.get('/register', function (req, res, next) {

    res.render('register', {title: 'Register'});
});

router.post('/register', function (req, res, next) {




    Account.register(new Account({
        username: req.body.username,
        email: req.body.email
    }), req.body.password, function (err, account) {
        if (err) {
            return res.render('register', {error: err.message});
            // return res.render('register', { account : account });
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

router.get('/forgot_password', function (req, res) {
    res.send('TODO');
});

router.get('/login', function (req, res) {
    res.render('login', {});
});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        badRequestMessage: 'Missing username or password.',
    } , function (error, user, info) {
        if (user) {
            req.logIn(user, {}, function(err) {
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


module.exports = router;
