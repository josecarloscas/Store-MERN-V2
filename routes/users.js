const express = require('express');
const validators = require('../handlers/validators');
const controller = require('../controllers/userController');
const { loggedIn } = require('../middlewares/auth');

//Se definen las rutas que permiten el manejo de los usuarios en la base de datos 
const router = express.Router();

router.post('/signup', validators.signUpValidator, controller.signUp);
router.post('/signin', validators.signInValidator, controller.signIn);
router.get('/items', loggedIn, controller.getCart);
router.get('/items/:itemId', loggedIn, controller.getCartItem);

module.exports = router;
