const express = require('express');
const validators = require('../handlers/validators');
const controller = require('../controllers/itemController');
const { loggedIn } = require('../middlewares/auth');

//Se definen las rutas que permiten el manejo de los productos en el carro 
const router = express.Router();

router.get('/', controller.getAllItems);
router.post('/add', validators.addItemValidator, loggedIn, controller.addItem);
router.post(
  '/remove',
  validators.removeItemValidator,
  loggedIn,
  controller.removeItem
);

module.exports = router;
