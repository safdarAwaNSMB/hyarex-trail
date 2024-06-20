const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');

router.post('/add-to-quotation', quotationController.createQuotation)
router.post('/remove-from-current-quotation', quotationController.removeFromCurrentQuotation)
router.post('/send-quotation', quotationController.sendQuotation)
router.post('/approve-quotation/:quotationId', quotationController.approveQuotation)
router.post('/offer-quotation/:quotationId', quotationController.offerQuotation)
router.post('/apply-commisions/:quotationId', quotationController.applyCommision)
router.post('/reject-quotation/:quotationId', quotationController.rejectQuotation)
router.get('/get-customer-quotations/:userEmail', quotationController.getCustomerQuotations)
router.get('/get-agent-quotations/:userEmail', quotationController.getAgentQuotations)
router.get('/get-all-quotations', quotationController.getAllQuotations)
router.get('/get-all-agents', quotationController.getAllAgents)
router.get('/get-user-current-quotation/:userEmail', quotationController.getUserCurrentQuotation)
// router.get('/get-ticket/:ticketId', supportController.getTicket)

module.exports = router;


