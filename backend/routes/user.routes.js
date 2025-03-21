import express from 'express';
import verifyToken from '../middlewares/verify.js';
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
import { Login } from '../controllers/access.controller.js';
import { requireOrgAdmin, requireSuperAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.post('/login', Login);

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
