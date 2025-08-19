import express from 'express';
import { registerUser, loginUser} from '../controllers/userController.js';

const router = express.Router();

router.get('/register', (req, res) => {
//   res.render('register.ejs'); // EJS view
});
router.post('/register', registerUser);

router.get('/login', (req, res) => {
//   res.render('login.ejs'); // EJS view
});
router.post('/login', loginUser);


export default router;
