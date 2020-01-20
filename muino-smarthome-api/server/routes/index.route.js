'use strict';
const express = require('express');

const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const adminRoutes = require('./admin.route');
const warningRoutes = require('./warning.route');
const prikklokRoutes = require('./prikklok.route');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK') 
);

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/admin',adminRoutes);
router.use('/warning', warningRoutes);
router.use('/prikklok', prikklokRoutes);


module.exports = router;
