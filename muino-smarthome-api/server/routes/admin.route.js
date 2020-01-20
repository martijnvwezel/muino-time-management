'use strict';
const express = require('express');
const passport = require('passport');
const userCtrl = require('../controllers/user.controller');
const admin = require('../middleware/require-admin');

const router = express.Router();
module.exports = router;

// * user part
router.post('/users', passport.authenticate('jwt', { session: false }), admin, userCtrl.getUsers);
router.post('/avatar', passport.authenticate('jwt', { session: false }), admin, userCtrl.avatar_upload_admin);
router.post('/role_add', passport.authenticate('jwt', { session: false }), admin, userCtrl.role_add);
router.post('/role_delete', passport.authenticate('jwt', { session: false }), admin, userCtrl.role_delete);
router.post('/updateusers', passport.authenticate('jwt', { session: false }), admin, userCtrl.updateUser);
router.delete('/user/:id', passport.authenticate('jwt', { session: false }), admin, userCtrl.removeUser); 
router.get('/userinfo/:id', passport.authenticate('jwt', { session: false }), admin, userCtrl.getUserInfo); 


