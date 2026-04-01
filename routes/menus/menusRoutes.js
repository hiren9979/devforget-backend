const express = require('express');
const router = express.Router();
const menusController = require('../../controllers/menus/menusController');

router.get('/', menusController.getAllMenusData);
router.get('/:id', menusController.getMenusDataById);
router.post('/create', menusController.createMenusData);
router.put('/:id', menusController.updateMenusDataById);
router.delete('/:id', menusController.deleteMenusDataById);

module.exports = router;