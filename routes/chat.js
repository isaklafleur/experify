const express = require('express');

const auth = require('../helpers/auth.js');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const Experience = require('../models/experience');

const router = express.Router();

// Start new conversation
router.post('/:idexp/new/:recipient', auth.checkLoggedIn('You need to login to access this page', '/login'), (req, res, next) => {
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
    experience: req.params.idexp,
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
      const idexp = req.params.idexp;
      Experience.findOne({ _id: idexp })
      .populate('user')
      .exec((err, result) => {
        if (err) {
          next(err);
        } else {
          res.render('chats/show', { result, newConversation, newMessage });
        }
      });
    });
  });
});

// Send reply in conversation
router.post('/:conversationId', auth.checkLoggedIn('You need to login to access this page', '/login'), (req, res, next) => {
  const reply = new Message({
    conversationId: req.params.conversationId,
    body: req.body.composedMessage,
    author: req.body.idsender,
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

// View messages to and from authenticated user
router.get('/', auth.checkLoggedIn('/login'), (req, res, next) => {
  // Only return one message from each conversation to display as snippet
  Conversation.find({ participants: req.user._id })
    .exec((err, conversations) => {
      if (conversations == []) {
        console.log('conversations object is empty for user');
        res.render('chats/index', { conversations });
      } else if (err) {
        console.log('error!');
        res.send({ error: err });
        return next(err);
      } else {
      const fullConversations = [];
      conversations.forEach((conversation) => {
        console.log('conversations has messages');
        Message.find({ conversationId: conversation._id })
          .populate('conversationId')
          .sort('-createdAt')
          .limit(1)
          .populate({
            path: 'author',
            select: 'name',
          })
          .exec((err, message) => {
            if (err) {
              res.send({ error: err });
              return next(err);
            }
            fullConversations.push(message);
            if (fullConversations.length === conversations.length) {
              // console.log(conversations);
              res.render('chats/index', { conversations: fullConversations });
            }
          });
      });
      }
    });
});

// Retrieve single conversation
router.get('/:expId/:conversationId', auth.checkLoggedIn('You need to login to access this page', '/login'), (req, res, next) => {
  const expId = req.params.expId;
  const conversationId = req.params.conversationId;
  const newMessage = {
    conversationId,
  };
  Message.find({ conversationId: req.params.conversationId })
    .select('createdAt body author')
    .sort('-createdAt')
    .populate({
      path: 'author',
      select: 'name',
    })
    .exec((err, messages) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }
      Experience.findOne({ _id: expId })
      .populate('user')
      .exec((err, result) => {
        if (err) {
          next(err);
        } else {
          res.render('chats/show', { conversation: messages, result, newMessage, messages });
        }
      });
    });
});

// Retrieve single conversation - API JSON
router.get('/:conversationId', auth.checkLoggedIn('You need to login to access this page', '/login'), (req, res, next) => {
  const expId = req.params.expId;
  const conversationId = req.params.conversationId;
  const newMessage = {
    conversationId,
  };
  Message.find({ conversationId: req.params.conversationId })
    .select('createdAt body author')
    .sort('-createdAt')
    .populate({
      path: 'author',
      select: 'name',
    })
    .exec((err, messages) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }
      res.status(200).json({ conversation: messages });
    });
});

module.exports = router;
