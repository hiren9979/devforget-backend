const express = require('express');
const authRoutes = require('./auth/authRoutes');
const superAdminRoutes = require('./superAdmin/superAdminRoutes');
const workspaceRoutes = require('./workspace/workspaceRoutes');
const menuRoutes = require('./menus/menusRoutes');
const formRoutes = require('./forms/formsRoutes');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use('/superAdmin', superAdminRoutes);
router.use('/auth', authRoutes);
router.use('/workspace', workspaceRoutes);
router.use('/menus', authMiddleware, menuRoutes);
router.use('/forms', formRoutes);

module.exports = router;