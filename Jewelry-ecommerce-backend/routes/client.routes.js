const express = require('express');
const router = express.Router();
const clientController = require('../controller/client.controller');

router.post('/add', clientController.createClient);
router.get('/all', clientController.getAllClients);

module.exports = router;
