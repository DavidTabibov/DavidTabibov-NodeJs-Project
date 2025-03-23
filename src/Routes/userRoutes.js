import express from 'express';
import { auth, isAdmin } from '../MiddleWare/authMiddleware.js';
import { loginUser, registerUser } from '../Controllers/authController.js';
import userController from '../Controllers/userController.js';
// הסר את הייבוא של validateUser
// import { validateUser } from '../Utils/validators/userValidators.js';

const router = express.Router();

// Public routes for login and registration
router.post('/login', loginUser);
router.post('/register', registerUser);

// Protected routes (authentication required)
router.get('/', auth, isAdmin, userController.getAllUsers);
router.get('/:id', auth, userController.getAllUsers);
router.put('/:id', auth, userController.updateUser); // במידת הצורך, תוכל לבדוק את הקלט בתוך הפונקציה updateUser
router.patch('/:id', auth, userController.changeBusinessStatus);
router.delete('/:id', auth, userController.deleteUser);

export default router;
