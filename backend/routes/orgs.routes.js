import express from 'express';
import {
  createOrg,
  getOrgs,
  getOrgById,
  updateOrg,
  deleteOrg,
  addUserToOrg,
  removeUserFromOrg,
  updateRoleUserInOrg,
  getOrgsByUserId,
  getUsersByOrgId,
} from '../controllers/org.controller.js';

import { requireOrgAdmin, requireSuperAdmin } from '../middlewares/auth.js';
import verifyToken from '../middlewares/verify.js';

const router = express.Router();

router.use(verifyToken);
router.post('/orgs', requireSuperAdmin, createOrg);
router.get('/orgs/all', requireSuperAdmin, getOrgs);
router.get('/orgs/:id', requireSuperAdmin, getOrgById);
router.put('/orgs/:id', requireSuperAdmin, updateOrg);
router.delete('/orgs/:id', requireSuperAdmin, deleteOrg);
router.put('/orgs/:id/users/:userId', requireSuperAdmin, updateRoleUserInOrg);

router.get('/org', getOrgsByUserId);
router.put('/org/users/:userId', requireOrgAdmin, updateRoleUserInOrg);
router.get('/org/:id/users', requireOrgAdmin, getUsersByOrgId);
router.post('/org/:id/users/:userId', requireOrgAdmin, addUserToOrg);
router.delete('/org/:id/users/:userId', requireOrgAdmin, removeUserFromOrg);

export default router;
