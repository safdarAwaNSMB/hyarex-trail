const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

router.post('/send-ticket-mail', supportController.sendMail)
router.post('/create-ticket', supportController.createTicket)
router.post('/close-ticket/:ticketId', supportController.closeTicket)
router.post('/send-message/:ticketId', supportController.sendMessage)
router.get('/get-all-tickets', supportController.getAllTickets)
router.get('/get-user-tickets/:userEmail', supportController.getUserTickets)
router.get('/get-ticket/:ticketId', supportController.getTicket)

module.exports = router;


