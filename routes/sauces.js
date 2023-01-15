const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauces');
const multer = require('../middlewares/multer-config')
const auth = require('../middlewares/auth')


router.get('/', auth, sauceCtrl.findSauces);
router.get('/:id', auth, sauceCtrl.findOneSauce);
router.post('/', auth, multer, sauceCtrl.addSauces);
router.put('/:id', auth, multer, sauceCtrl.modifySauce)
router.delete('/:id', auth, sauceCtrl.deleteSauce)


module.exports = router;