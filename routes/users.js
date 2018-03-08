var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require('../models/User')

router.post('/', function (req, res, next) {
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
    })
    user.save(function (err, user) {
        if (err) {
            return res.status(500).json({
                title: 'Server error',
                error: err
            })
        }
        res.status(201).json({
            message: 'User signed up',
            obj: user
        })
    })
});

router.post('/signin', function (req, res, next) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'Server error',
                error: err
            })
        }
        if (!user) {
            return res.status(401).json({
                title: 'User not found',
                error: {
                    message: 'No user found'
                }
            })
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'User not found',
                error: {
                    message: 'No user found'
                }
            })
        }
        var token = jwt.sign({
            user: user
        }, 'mySecret', {
            expiresIn: 7200
        })
        res.status(200).json({
            message: 'User loged in',
            token: token,
            userId: user._id
        })
    })
});

module.exports = router;