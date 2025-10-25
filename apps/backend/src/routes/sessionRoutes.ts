import express, { Router } from "express"
import {
  createSession,
  getUserSessions,
  getSessionById,
  updateSession,
  updateSessionStatus,
  deleteSession,
} from '../controllers/sessionController.js';
import { authenticate } from "../middleware/auth.js";

const router: Router = express.Router();

router.use(authenticate);

router.post('/', createSession);
router.get('/', getUserSessions);
router.get('/:id', getSessionById);
router.put('/:id', updateSession);
router.patch('/:id/status', updateSessionStatus);
router.delete('/:id', deleteSession);

export default router