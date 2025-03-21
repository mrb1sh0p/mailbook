import express from 'express';
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUsers,
} from '../controllers/user.controller.js';

import {
  getOrgsByUserId,
  getUsersByOrgId,
} from '../controllers/org.controller.js';

import { verifyToken } from '../middleware/verify.js';
import { requireOrgAdmin, requireSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);
router.get('/user', getUserById);
router.put('/user', updateUser);
router.get('/user/orgs', getOrgsByUserId);

router.get('/users', requireSuperAdmin, getUsers);

router.use(requireOrgAdmin);
router.get('/users', getUsersByOrgId);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
