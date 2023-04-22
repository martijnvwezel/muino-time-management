'use strict';
const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const authCtrl = require('../controllers/auth.controller');
const userCtrl = require('../controllers/user.controller');
const User = require('../models/user.model');
const config = require('./config');
const warningCtrl = require('../controllers/warning.controller');

const localLogin = new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {

  // remove alle whitespace not just spaces
  // email=email.replace(/\s/g,'');
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let user;
  if (email.indexOf('@') > -1) {
    user = await User.findOne({ email });
    console.log("email ", email);
  } else {
    user = await User.findOne({ username: email });
    console.log("username", email);
  }

  var bcrypt_ans = false;
  let user_old_hash_system = false;
  if (user && (user.nSalt && user.hashedPassword)) {
    // take the login.password add some salt and a sha512 hash then the
    bcrypt_ans = bcrypt.compareSync(authCtrl.sha512(password, user.nSalt).passwordHash, user.hashedPassword);
  } else {
    if (user && user.hashedPassword) {
      bcrypt_ans = bcrypt.compareSync(password, user.hashedPassword);
      let status = {};
      status.source = "LocalLogin"
      status.type = "Warning";
      status.causedBy = "(passport.js:41) User hash not a hashpasswd";
      status.extra = user._id + " ; " + user.fullname + " ; " + ip + ";";
      warningCtrl.saveWarning(status);
      user_old_hash_system = true;
    } else {
      let status = {};
      status.source = "LocalLogin"
      status.type = "error";
      status.causedBy = "(passport.js:48) Cannot find user in database.";
      status.extra = "User not exist";
      warningCtrl.saveWarning(status);
    }
  }


  if (!user || !bcrypt_ans) {
    let status = {};
    status.source = "LocalLogin"
    status.type = "warning";
    status.causedBy = "(passport.js:63) User login failed."
    status.extra = user.email + ";" + ip;
    warningCtrl.saveWarning(status);
    return done(null, false, { error: 'Your login details could not be verified. Please try again.' });
  }

  user = user.toObject();

  if (user_old_hash_system) {
    if (email.indexOf('@') < 0) {
      return done(null, false, { error: 'Your login details could/are verified. But the there is an account updated needed on your account. Please login with your email this time!' });
    }

    let user_update = {};
    user_update['password'] = password;
    user_update['repeatPassword'] = password;
    user_update['user_id'] = String(user._id);
    user_update['email'] = user.email;
    user_update['username'] = user.username;
    console.log(user);
    let updatedUser = await userCtrl.updateUser(user_update);
    console.log(updatedUser);
    user = updatedUser;

    let status = {};
    status.source = "LocalLogin"
    status.type = "ATTENTION";
    status.causedBy = "(passport.js:87) User account UPDATED.";

    status.extra = JSON.stringify(user) + ";" + ip;
    warningCtrl.saveWarning(status);


  }
  delete user.hashedPassword;
  if (user.nSalt) {
    delete user.nSalt;
  }
  let status = {};
  status.source = "LocalLogin"
  status.type = "succes";
  status.causedBy = "(passport.js:88) login Success.";
  status.extra = user.email + ";" + ip;

  warningCtrl.saveWarning(status);
  done(null, user);
});

const jwtLogin = new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret
}, async (payload, done) => {
  console.log(payload._id);

  let user = await User.findById(payload._id);
  if (!user) {
    console.log("user not known");
    return done(null, false);
  }

  user = user.toObject();
  delete user.hashedPassword;
  if (user.nSalt) { // backward compatibility
    delete user.nSalt;
  }


  done(null, user);
});

passport.use(jwtLogin);
passport.use(localLogin);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});




module.exports = passport;
