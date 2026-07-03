const express = require('express');
const router = express.Router();
const invoiceController = require('../controller/invoice.controller');

router.post('/add', invoiceController.createInvoice);
router.get('/all', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getSingleInvoice);
router.patch('/:id', invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);
router.patch('/:id/return', invoiceController.returnInvoiceItems);

module.exports = router;
