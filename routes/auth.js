const express = require('express');
// Accèder au rooter express
const router = express.Router();

const userCtrl = require('../controllers/auth');
// Associé une fonction de mon controller à une route et une méthode
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);


module.exports = router;