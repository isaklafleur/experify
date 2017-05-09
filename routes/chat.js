// const passport = require('passport');

// const AuthenticationController = require('../controllers/authentication');
// const UserController = require('../controllers/user');
const ChatController = require('../controllers/chat');
const express = require('express');
// const passportService = require('../config/passport');

const router = express.Router();
// const authRoutes = express.Router();
// const chatRoutes = express.Router();

// Set chat routes as a subgroup/middleware to apiRoutes
// apiRoutes.use('/chat', chatRoutes);

// View messages to and from authenticated user
router.get('/', /* requireAuth, */ ChatController.getConversations);


router.get('/test', (req, res, next) => {
  res.render('chats/show');
});

// Retrieve single conversation
router.get('/:conversationId', /* requireAuth, */ ChatController.getConversation);

// Send reply in conversation
router.post('/:conversationId', /* requireAuth, */ ChatController.sendReply);

// Start new conversation
router.post('/new/:recipient', /* requireAuth, */ ChatController.newConversation);



module.exports = router;
