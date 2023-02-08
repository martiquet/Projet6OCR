const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauces');
const multer = require('../middlewares/multer-config')
const auth = require('../middlewares/auth')

// Associé une fonction de mon controller à une route et une méthode

router.get('/', auth, sauceCtrl.findSauces);
router.get('/:id', auth, sauceCtrl.findOneSauce);
router.post('/', auth, multer, sauceCtrl.addSauces);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.sysLike);


module.exports = router;