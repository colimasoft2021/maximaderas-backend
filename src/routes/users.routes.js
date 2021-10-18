import express from 'express';
const router = express.Router();
import UsersController from '../controllers/users.controller';

router.post('/save-user', UsersController.saveUser);
export default router;
