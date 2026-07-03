const express = require('express');
const router = express.Router();
const settingsController = require('../controller/settings.controller');

// get storefront settings
router.get('/storefront', settingsController.getStorefrontSettings);

// update storefront settings
router.put('/storefront', settingsController.updateStorefrontSettings);

module.exports = router;
