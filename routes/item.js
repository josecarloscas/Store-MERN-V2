const express = require('express');
const validators = require('../handlers/validators');
const controller = require('../controllers/itemdbController');
const { loggedIn } = require('../middlewares/auth');

const router = express.Router();

router.post('/additemdb', validators.itemDbValidator, controller.addItemdb);
router.post('/removeitemdb');
router.get('/itemsdb');
router.get('/itemsdb/:itemdbId');

module.exports = router;
