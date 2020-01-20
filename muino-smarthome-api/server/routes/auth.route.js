'use strict';
const express = require('express');
const asyncHandler = require('express-async-handler')
const passport = require('passport');
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');

const router = express.Router();
module.exports = router;


router.post('/register', asyncHandler(register), login);
router.post('/login', passport.authenticate('local', { session: false }), login);
router.get('/me', passport.authenticate('jwt', { session: false }), me);

router.post('/password-reset', userCtrl.passwordReset);
router.post('/password-reset/:id', userCtrl.passwordResetLink);




async function register(req, res, next) {
  const insert_response = await userCtrl.insert(req, res, req.headers['x-forwarded-for'] || req.connection.remoteAddress);

  if (insert_response.succes) {
    let user = insert_response.register_user
    user = user.toObject();
    delete user.hashedPassword;
    req.user = user; 
    next();
  }

}

function login(req, res) {
  let user = req.user;
  console.log("Login by: ", user.username);

  let token = authCtrl.generateToken(user);
  return res.json({ succes: true, user, token });
}

function me(req, res) {
  let user = req.user;
  console.log("Login by [token]: ", user.username);

  let token = authCtrl.generateToken(user);

  return res.json({ user, token });
}