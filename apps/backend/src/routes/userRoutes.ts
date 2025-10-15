import express, { Router } from "express"
import { register, login } from "../controllers/authController.js"
import { getUserById } from "../controllers/userController.js"
import { authenticate } from "../middleware/auth.js"

const router: Router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/userId', getUserById)

export default router