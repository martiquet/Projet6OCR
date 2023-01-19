const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http');
const UserAccount = require('./models/User');
const dotenv = require("dotenv");
dotenv.config();
const User = require('./routes/auth');
const Sauces = require('./routes/sauces');
const path = require('path');
const cors = require('cors')
const fs = require('fs');
const rateLimit = require('express-rate-limit')

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to API calls only
app.use('/api', apiLimiter)


app.use(cors())

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;


mongoose.connect(`mongodb+srv://`+DB_USER+`:`+DB_PASSWORD+`@`+DB_HOST+``,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', User);
app.use('/api/sauces', Sauces);





module.exports = app;

// HELMET, EXPRESS RATE LIMIT, MONGO MASK