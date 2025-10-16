import express, { Router } from "express"
import { register, login } from "../controllers/authController.js"
import { getUserById, searchUser, getAllUsers } from "../controllers/userController.js"
import { authenticate } from "../middleware/auth.js"

const router: Router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/userId', getUserById)
router.get('/search', searchUser)
router.get('/getAllUsers', getAllUsers)

export default router