const express = require('express');
const router = express.Router();
const { createSuperAdmin } = require('../../controllers/superAdmin/superAdminController');

router.post('/create', createSuperAdmin);

module.exports = router;