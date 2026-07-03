const express = require('express');
const router = express.Router();
const memoController = require('../controller/memo.controller');

router.post('/add', memoController.createMemo);
router.get('/all', memoController.getAllMemos);
router.get('/:id', memoController.getSingleMemo);
router.patch('/:id/return', memoController.returnMemoItems);
router.post('/:id/invoice', memoController.convertMemoToInvoice);
router.patch('/:id', memoController.updateMemo);
router.delete('/:id', memoController.deleteMemo);

module.exports = router;
