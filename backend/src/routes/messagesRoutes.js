const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');

router.post('/send-message/:adminMail/:agentMail', messagesController.addMessage)
router.get('/get-messages/:adminMail/:agentMail', messagesController.getMessages)
router.get('/get-admin-messages-agents/:adminMail', messagesController.getAdminAgents)

module.exports = router;


