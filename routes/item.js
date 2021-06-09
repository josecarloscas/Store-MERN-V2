const express = require('express');
const validators = require('../handlers/validators');
const controller = require('../controllers/itemdbController');
const { loggedIn } = require('../middlewares/auth');

//Se definen las rutas que permiten el manejo de los productos en la base de datos 
const router = express.Router();

router.post('/additemdb', validators.itemDbValidator, controller.addItemdb);
router.post('/removeitemdb');
router.get('/itemsdb');
router.get('/itemsdb/:itemdbId');

module.exports = router;
