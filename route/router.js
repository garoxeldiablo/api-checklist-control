import express from "express";
import { getUsers, login, logout, register } from '../controller/users.js';

import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controller/RefreshToken.js";
import { checkLists } from "../controller/checklists.js";
import { addTask } from "../controller/tasksFromManager.js";
import { updateTaskMandatoryStatus } from "../controller/updateTaskFromStaff.js";
import { submitTask } from "../controller/submissionStaff.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/addchecklists', checkLists)
router.post('/addtask', addTask)
router.post('/submitTask', submitTask)

router.put('/tasks/:taskId/mandatory', updateTaskMandatoryStatus);

router.get('/users', verifyToken, getUsers);
router.get('/token', refreshToken);


router.delete('/logout', logout);

export default router;