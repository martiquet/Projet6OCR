const express = require('express');
const Sauces = require('../models/sauces')
const router = express.Router();
const sauceCtrl = require('../controllers/sauces');
const multer = require('../middlewares/multer-config')
const auth = require('../middlewares/auth')


router.get('/', auth, sauceCtrl.findsauces);
router.get('/:id', auth, sauceCtrl.findonesauce);
router.post('/', auth, multer, sauceCtrl.addsauces);

  module.exports = router;