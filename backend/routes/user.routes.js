import express from 'express';
import verifyToken from '../middlewares/verify.js';
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUsers,
} from '../controllers/user.controller.js';

import { getOrgsByUser, getUsersByOrg } from '../controllers/org.controller.js';
import {
  Login,
  getUserData,
  LoginOverlord,
} from '../controllers/access.controller.js';
import { requireOrgAdmin, requireSuperAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.post('/login', Login);
router.post('/login/overlord', LoginOverlord);

router.use(verifyToken);
router.get('/user', getUserById);
router.get('/userdata', getUserData);
router.put('/user', updateUser);
router.get('/user/orgs/:id', getOrgsByUser);

router.get('/users', requireSuperAdmin, getUsers);

router.use(requireOrgAdmin);
router.get('/users', getUsersByOrg);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
