var express = require('express');
var Account = require('../models/account');
var passport = require('passport');

var router = express.Router();

/* GET home page. */
router.get('/register', function(req, res, next) {

  res.render('register', { title: 'Register' });
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { error : err.message });


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

router.get('/forgot_password', function(req, res) {
    res.send('TODO');
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/error' }), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});



module.exports = router;
