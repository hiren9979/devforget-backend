const express = require('express');
const router = express.Router();
const workspaceController = require('../../controllers/workspace/workspaceController');
const { superAdminMiddleware } = require('../../middlewares/superAdminMiddleware');
const { authMiddleware } = require('../../middlewares/authMiddleware');

router.get('/', authMiddleware, workspaceController.getAllWorkspaceData);
router.get('/:id', authMiddleware, workspaceController.getWorkspaceDataById);
router.post('/create', superAdminMiddleware, workspaceController.createWorkspaceData);
router.put('/:id', workspaceController.updateWorkspaceDataById);
router.delete('/:id', workspaceController.deleteWorkspaceDataById);

module.exports = router;

// {
//     "statusCode": 201,
//     "data": {
//         "workspace": {
//             "id": "fb779b37-2daf-11f1-b0f0-b06ebf82bf89",
//             "name": "Test Workspace",
//             "email": "workspace@test.com",
//             "phone": "1234567890",
//             "logoUrl": "https://example.com/logo.png",
//             "address": "123 Test Street, Test City",
//             "isActive": 1,
//             "isDeleted": 0,
//             "deletedBy": null,
//             "createdAt": "2026-04-01T09:48:48.000Z",
//             "createdBy": null,
//             "updatedAt": "2026-04-01T09:48:48.000Z",
//             "updatedBy": null
//         },
// "adminUser": {
//             "email": "admin@test.com",
//             "password": "41b6bp6is95f",
//             "name": "Admin User"
//         }
//     }
// }