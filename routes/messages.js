var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Message = require('../models/Message')
var User = require('../models/User')

router.get('/', function (req, res, next) {
    Message.find()
        .populate('user', 'firstName')
        .exec(function (err, msgs) {
            if (err) {
                return res.status(500).json({
                    title: 'Server error',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: msgs
            })
        })
});

router.use('/', function (req, res, next) {
    jwt.verify(req.query.token, 'mySecret', function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: err
            })
        }
        next();
    })
})

router.post('/', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    User.findById(decoded.user._id, (err, user) => {
        if (err) {
            return res.status(500).json({
                title: 'Server error',
                error: err
            })
        }
        var message = new Message({
            content: req.body.content,
            user: user._id,
        })

        message.save(function (err, msg) {
            if (err) {
                return res.status(500).json({
                    title: 'Server error',
                    error: err
                })
            }
            user.messages.push(msg);
            user.save();

            res.status(201).json({
                message: 'Message saved',
                obj: msg
            })
        })
    })

});

router.patch('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Message.findById(req.params.id, (err, message) => {
        if (err) {
            return res.status(500).json({
                title: 'Server error',
                error: err
            })
        }
        if (!message) {
            return res.status(500).json({
                title: 'No message found',
                error: {
                    message: 'Message not found'
                }
            })
        }
        if (message.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Auth',
                error: {
                    message: 'Users not match'
                }
            })
        }
        message.content = req.body.content;
        message.save(function (err, msg) {
            res.status(200).json({
                message: 'Updated message',
                obj: msg
            })
        })
    })
});

router.delete('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Message.findById(req.params.id, (err, message) => {
        if (err) {
            return res.status(500).json({
                title: 'Server error',
                error: err
            })
        }
        if (!message) {
            return res.status(500).json({
                title: 'No message found',
                error: {
                    message: 'Message not found'
                }
            })
        }
        if (message.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Auth',
                error: {
                    message: 'Users not match'
                }
            })
        }
        message.remove(function (err, msg) {
            res.status(200).json({
                message: 'Deleted message',
                obj: msg
            })
        })
    })
});

module.exports = router;