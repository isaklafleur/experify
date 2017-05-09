// const passport = require('passport');

// const AuthenticationController = require('../controllers/authentication');
// const UserController = require('../controllers/user');
// const ChatController = require('../controllers/chat');
const express = require('express');

const auth = require('../helpers/auth.js');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const Chat = require('../models/chat');
// const User = require('../models/user');

const router = express.Router();

router.get('/:idexp/:idhost/:idbuyer', auth.checkLoggedIn('You must be login', '/login'), (req, res, next) => {
  res.render('chats/show');
  const idexp = req.params.idexp;
});

// SHOW one experience
router.get('/:id', (req, res, next) => {
  const idexp = req.params.id;
  Experience.findOne({ _id: idexp })
  .populate('user')
  .exec((err, result) => {
    if (err) {
      next(err);
    } else {
      // console.log(result);
      res.render('experiences/show', { result });
    }
  });
});



// View messages to and from authenticated user
router.get('/', (req, res, next) => {
  // Only return one message from each conversation to display as snippet
  Conversation.find({ participants: req.user._id })
    .select('_id')
    .exec((err, conversations) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      // Set up empty array to hold conversations + most recent message
      let fullConversations = [];
      conversations.forEach((conversation) => {
        Message.find({ conversationId: conversation._id })
          .sort('-createdAt')
          .limit(1)
          .populate({
            path: 'author',
            select: 'profile.firstName profile.lastName',
          })
          .exec((err, message) => {
            if (err) {
              res.send({ error: err });
              return next(err);
            }
            fullConversations.push(message);
            if (fullConversations.length === conversations.length) {
              return res.status(200).json({ conversations: fullConversations });
            }
          });
      });
    });
});

// Retrieve single conversation
router.get('/:conversationId', (req, res, next) => {
  Message.find({ conversationId: req.params.conversationId })
    .select('createdAt body author')
    .sort('-createdAt')
    .populate({
      path: 'author',
      select: 'profile.firstName profile.lastName',
    })
    .exec((err, messages) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }
      res.status(200).json({ conversation: messages });
    });
});

// Send reply in conversation
router.post('/:conversationId', (req, res, next) => {
  const reply = new Message({
    conversationId: req.params.conversationId,
    body: req.body.composedMessage,
    author: req.user._id,
  });

  reply.save((err, sentReply) => {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    res.status(200).json({ message: 'Reply successfully sent!' });
    return (next);
  });
});

// Start new conversation
router.post('/new/:recipient', (req, res, next) => {
  if (!req.params.recipient) {
    res.status(422).send({ error: 'Please choose a valid recipient for your message.' });
    return next();
  }

  if (!req.body.composedMessage) {
    res.status(422).send({ error: 'Please enter a message.' });
    return next();
  }

  const conversation = new Conversation({
    participants: [req.user._id, req.params.recipient],
  });

  conversation.save((err, newConversation) => {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    const message = new Message({
      conversationId: newConversation._id,
      body: req.body.composedMessage,
      author: req.user._id,
    });

    message.save((err, newMessage) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      res.status(200).json({ message: 'Conversation started!', conversationId: conversation._id });
      return next();
    });
  });
});

module.exports = router;
