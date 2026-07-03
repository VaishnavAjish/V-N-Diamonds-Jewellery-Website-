const express = require('express');
const router = express.Router();
const settingController = require('../controller/setting.controller');
// We can use verifyAdmin if we want to restrict PUT to admin only. For now let's just make sure it exists.
const { verifyAdmin } = require('../middleware/verifyToken');

// Get setting by key (Public access for storefront)
router.get('/:key', settingController.getSettingByKey);

// Update setting by key (Admin access only)
router.put('/:key', verifyAdmin, settingController.upsertSettingByKey);

module.exports = router;
