'use strict';
const bcrypt = require('bcrypt');
const Joi = require('joi');
const fs = require('fs');
const mongoose = require('mongoose');
// needed for 
const uuidv4 = require('uuid/v4');
const nodemailer = require("nodemailer");
const config = require('../config/config');

const User = require('../models/user.model');
const Passwordrst = require('../models/passwordrst.model');
const authCtrl = require('../controllers/auth.controller');
const exist_role = require('../middleware/shared_functions')
const telegram = require('../middleware/telegram');

function objectId() {
  return Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id');
};

const userSchema = Joi.object({
  firstname: Joi.string(),
  fullname: Joi.string(),
  lastname: Joi.string(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  repeatPassword: Joi.string().valid(Joi.ref('password')),
  phonenumber: Joi.string(),//.regex(/^[1-9][0-9]{9}$/),
  acitvity_status: Joi.string(),
  avatar_path: Joi.string(),
  company_Path: Joi.string(),
  roles: Joi.array().items(Joi.string())
});

const resetSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string(),
  repeatPassword: Joi.string().valid(Joi.ref('password'))
})

const telegramSchema = Joi.object({
  bot_id: Joi.string().allow(''),
  api_token: Joi.string().allow(''),
  chat_id: Joi.string().allow('')
});

const imageSchema = Joi.object({
  image: Joi.string()
});


const imageSchema_admin = Joi.object({
  image: Joi.string(),
  user_id: Joi.string(),
});



const userUpdateSchema = Joi.object({
  firstname: Joi.string().allow(''),
  fullname: Joi.string().allow(''),
  lastname: Joi.string().allow(''),
  username: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string(),
  repeatPassword: Joi.string().valid(Joi.ref('password')),
  phonenumber: Joi.string().allow(''),//.regex(/^[1-9][0-9]{9}$/),
  avatar_path: Joi.string().allow(''),
  company_Path: Joi.string().allow(''),
  acitvity_status: Joi.string(),
  company: Joi.string().allow(''),
  location: Joi.string().allow(''),
  hour_rate: Joi.number(),
  roles: Joi.array().items(Joi.string()),
  user_id: Joi.string().required(),
  telegram: telegramSchema

})

const IDScheme = Joi.object({
  _id: objectId(),// objectId
});

module.exports = {
  insert,
  getUsers,
  updateUser,
  getUserInfo,
  removeUser,
  avatar_upload,
  role_delete,
  role_add,
  avatar_upload_admin,
  passwordReset,
  passwordResetLink
}



async function insert(req, res, ip) {


  ip = ip ? ip : "0.0.0.0";
  const result = Joi.validate(req.body, userSchema);
  
  if (result.error) {
    return res.json({ result: result.error.name, success: false });
  }


  let user_save = result.value;
  var salt = authCtrl.genRandomString(16); /** Gives us salt of length 16 */
  var passwordData = authCtrl.sha512(user_save.password, salt);
  user_save['nSalt'] = salt;
  user_save.hashedPassword = bcrypt.hashSync(passwordData.passwordHash, 10);

  delete user_save.password;
  delete user_save.repeatPassword;

  user_save["acitvity_status"] = "onhold";
  // ! Danger
  if (user_save.email === "martijnvwezel@muino.nl") {
    user_save.roles = ["admin"];
    user_save["acitvity_status"] = "active";
  }
  let register_user;

  try {
    register_user = await new User(user_save).save();
    let teleg_msg = "New user: " + register_user.username + " | " + register_user.firstName + " | " + register_user.email + " | " + ip;
    telegram.telegram(teleg_msg);

    return res.json({ succes: true, register_user });


  } catch (e) {

    if (e.name === 'MongoError' && e.code === 11000) {

      let key = e.errmsg.split('index: ')[1].split("_1")[0];
      let keyvalue = e.errmsg.split('{ : ')[1].split('}')[0];
      let errmsg = "The " + key + " already  exist -> " + keyvalue;

      let result_ = { key, errmsg, keyvalue };
      return res.json({ succes: false, result: result_ });
    } else if (e.errors) { // * mongoose error

      let key = e.path;
      let errmsg = e.message;
      let keyvalue = e.value;
      let result_ = { key, errmsg, keyvalue };
      console.log(errmsg);
      return res.json({ succes: false, result: result_ });

    }
    else {
      let key = "unknown error is not";
      let keyvalue = "contact admin of the webpage";
      let errmsg = key + " defined" + keyvalue;

      let result_ = { key, errmsg, keyvalue };
      return res.json({ succes: false, result: result_ });

    }

  }
}


/**
* @brief Get user info
* @param user_id from url
* @retval None
*/
async function getUserInfo(req, res) {

  var user_id = { '_id': req.params.id }; // fix for validation

  const result = Joi.validate(user_id, IDScheme);

  if (result.error) {
    return res.status(400).json({ result: result.error });
  }

  let user = await User.aggregate([
    {
      $match: {
        "_id": { "$in": [mongoose.Types.ObjectId(user_id._id)] }
      }
    },
    {
      $project: {
        "_id": 0,
        "firstname": 1,
        "fullname": 1,
        "lastname": 1,
        "username": 1,
        "email": 1,
        "phonenumber": 1,
        "acitvity_status": 1,
        "avatar_path": 1,
        "company_Path": 1,
        "company": 1,
        "location": 1,
        "hour_rate": 1,
        "telegram": {
          "bot_id": 1,
          "api_token": 1,
          "chat_id": 1,
        },
        "roles": 1,
      }
    }
  ]);

  return res.json({ success: true, user });
}




/**
* @brief Remove the user
* @param user_id of user that needs to be removed
* @retval Sent user object
*/
async function removeUser(req, res) {
  var _id = { '_id': req.params.id }; // * fix for validation
  const result = Joi.validate(_id, IDScheme);

  if (result.error) {
    return res.status(400).json({ result: result.error });
  }

  // TODO remove this statement is not really usefull anymore

  let removed_user = await User.findByIdAndRemove(_id._id);
  let tempid;

  try {
    // Because mongo dataObject
    var temp = removed_user.toObject();
    tempid = temp._id;
    delete temp.hashedPassword;
    delete temp.nSalt;
    removed_user = temp;
  } catch (e) { 
    console.log(e);
    
  }

  let removedUSerError = "removed user: " + JSON.stringify(removed_user);
  console.log(removedUSerError);



  return res.json({ success: true, error: removedUSerError });
}



/**
* @brief Get list of users on the server
* @param None
* @retval None
*/
async function getUsers(req, res) {
  // * console.time("getUsers");

  let users = await User.aggregate([
    {
      $project: {
        "_id": 1,
        "fullname": 1,
        "email": 1,
        "roles": 1,
        "avatar_path": 1,
        "acitvity_status": 1,
        "createdAt": 1

      }
    }
  ]);

  // * console.timeEnd("getUsers"); // find = 15ms aggregate = +9ms
  return res.json({ success: true, users });
}


// * add a user role
// TODO  check if role is a role that exist
async function role_add(req, res) {
  let user = req.user;
  let body_user = req.body;

  if (!exist_role(user, 'admin')) {
    console.log("None admin [setRole]", user);
    return res.json({ error: true });
  }

  // ADD ADD ADD
  var update = {
    $addToSet: { roles: [body_user.role] }
  }
  console.log("Add: ", body_user);

  await User.findByIdAndUpdate(body_user.id_user, update);

  let updated_user = await User.find({ _id: body_user.id_user });
  return res.json({ success: true, user: updated_user });


}

// * remove a user role
// TODO  check if role is a role that exist
async function role_delete(req, res) {
  let user = req.user;
  let body_user = req.body;

  if (!exist_role(user, 'admin')) {
    console.log("None admin [setRole]", user);
    return res.json({ error: true });
  }
  console.log("Remove: ", body_user);

  // REMOVE REMOVE REMOVE 
  var update = {
    $pull: { roles: body_user.role }
  }

  await User.findByIdAndUpdate(body_user.id_user, update);

  let updated_user = await User.find({ _id: body_user.id_user });
  return res.json({ success: true, user: updated_user });


}


async function updateUser(req, res) {

  const result = Joi.validate(req.body, userUpdateSchema);
  if (result.error) {
    return res.status(400).json({ result: result.error });
  }

  let temp_user = result.value;

  if (result.value && result.value.password && (result.value.password == result.value.repeatPassword)) {
    let salt = authCtrl.genRandomString(16); /** Gives us salt of length 16 */
    let passwordData = authCtrl.sha512(result.value.password, salt);
    temp_user['nSalt'] = salt;
    temp_user.hashedPassword = bcrypt.hashSync(passwordData.passwordHash, 10);
    delete temp_user.password;
  }

  let _id = temp_user.user_id;
  delete temp_user.user_id;
  // console.log(_id,"--",temp_user);

  let updatedUser = await User.findByIdAndUpdate(_id, temp_user, { upsert: true, new: true });
  // console.log(updatedUser);
  try {
    let temp = updatedUser.toObject();
    delete temp.hashedPassword;
    delete temp.nSalt;
    delete temp.createdAt;
    updatedUser = temp;
  } catch (e) { }

  return res.json({ success: true, updatedUser });//return a json array with users
}



async function avatar_upload(req, res) {

  const result = Joi.validate(req.body, imageSchema);

  if (result.error) {
    return res.json({ result: result.error, success: false });
  }

  // get user id (will become image name)
  // console.log("user: ", req.user._id);

  // console.log(result.value.image.substr(0, 10));

  let image = result.value.image;

  // * get info of image
  var matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  // * get file type
  var get_imageType = /\/(.*?)$/;
  let fileType = response.type.match(get_imageType)[1];

  let filename = "avatar-" + String(req.user._id) + "." + fileType; // aanpassen met random seed
  console.log(filename);


  // save to disk 
  var distDir = '';
  if (config.env == 'development') {
    var distDir = '../muino-angular/dist/muino/';
    console.log("development");

  } else {
    var distDir = 'dist/muino/';
  }

  // https://nodejs.org/api/child_process.html
  const { spawn } = require('child_process');
  const ls = spawn('ls', ['-lh', distDir + "assets/img/avatars/"]);

  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  console.log(distDir + "assets/img/avatars/" + filename);

  fs.writeFile(distDir + "assets/img/avatars/" + filename, response.data, function (err) {
    if (err) {
      return new Error(err);
    }
  });

  // TODO remove old filename - can be security issue idk

  let update = {};
  update.avatar_path = filename;

  // let updatedUser = await User.findByIdAndUpdate(req.user._id, update, { new: true });

  // console.log(updatedUser);

  // update path of user, so object id and user file extention
  // send success
  return res.json({ success: true });
}




async function avatar_upload_admin(req, res) {

  const result = Joi.validate(req.body, imageSchema_admin);

  if (result.error) {
    return res.json({ result: result.error, success: false });
  }

  // get user id (will become image name)
  // console.log("user: ", req.user._id);
  // console.log("user_to_change: ", result.value.user_id);

  // console.log(result.value.image.substr(0, 10));

  let image = result.value.image;
  let user_id = result.value.user_id;

  // * get info of image
  var matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  // * get file type
  var get_imageType = /\/(.*?)$/;
  let fileType = response.type.match(get_imageType)[1];

  let filename = "avatar-" + String(user_id) + "." + fileType; // aanpassen met random seed
  // console.log(filename);


  // save to disk 
  var distDir = '';
  if (config.env == 'development') {
    var distDir = '../muino-angular/dist/muino/';
    console.log("development");

  } else {
    var distDir = 'dist/muino/';
  }

  // https://nodejs.org/api/child_process.html
  const { spawn } = require('child_process');
  const ls = spawn('ls', ['-lh', distDir + "assets/img/avatars/"]);

  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  console.log("admin: ", distDir + "assets/img/avatars/" + filename);

  fs.writeFile(distDir + "assets/img/avatars/" + filename, response.data, function (err) {
    if (err) {
      return new Error(err);
    }
  });

  // TODO remove old filename - can be security issue idk

  let update = {};
  update.avatar_path = filename;

  let updatedUser = await User.findByIdAndUpdate(user_id, update, { new: true });

  console.log(updatedUser);

  // update path of user, so object id and user file extention
  // send success
  return res.json({ success: true });
}







/**
 * @brief  Generate password reset link
 * @param email The email of the user
 * @retval array with for each week a 
 */
async function passwordReset(req, res) {

  const result = Joi.validate(req.body, resetSchema);

  if (result.error) {
    return res.status(400).json({ result: result.error });
  }

  // check if user email in database
  let user = (await User.find({ email: result.value.email }))[0];

  if (!user || (user && (user.email !== result.value.email))) {// check of dit alles afvangt
    return res.json({ success: false });
  }

  // generate reset link
  let resetlink = {
    randomid: (uuidv4()),
    email: result.value.email,
    active: false
  };

  // save to database reset-links
  await new Passwordrst(resetlink).save();

  // send email to person

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: config.email.smtp_host,
    port: config.email.smtp_port,
    secure: config.email.smtp_secure, // true for 465, false for other ports
    auth: {
      user: config.email.smtp_user, // generated ethereal user
      pass: config.email.smtp_pass // generated ethereal password
    }
  });


  // send mail with defined transport object
  let info;
  try {
    info = await transporter.sendMail({
      from: '"No-reply" ' + config.email.smtp_user,
      to: resetlink.email,
      subject: "Password reset",
      text: "https://muino.nl/password-reset/" + resetlink.randomid
    });

  } catch (e) {
    console.log(e);
    let teleg_msg = "Error sending password reset email failed id:[" + String(resetlink.randomid) + "]";
    telegram.telegram( teleg_msg);

  }
  console.log("Message sent: %s", info.messageId);
  // todo make warning msg 

  return res.json({ success: true });
}


/**
 * @brief  Use reset link to generate update password
 * @param email The email of the user
 * @param password The new password
 * @param repeatedpassword This should be the reset link
 * @retval msg is is went successfull 
 */
async function passwordResetLink(req, res) {

  let id = req.params.id;
  const result = Joi.validate(req.body, resetSchema);

  if (result.error) {
    return res.status(400).json({ result: result.error.name });
  }

  // check if link excist in database 
  let resetlink = (await Passwordrst.find({ randomid: id }))[0];

  if (resetlink.active || resetlink.email !== result.value.email) {
    return res.json({ success: false, msg: "Reset link/email failed" });
  }

  if (!resetlink.expireDate || !(new Date() < resetlink.expireDate)) { // (new Date(+new Date() + 3 * 24 * 60 * 60 * 1000)
    resetlink.active = true;
    await Passwordrst.findByIdAndUpdate(resetlink._id, resetlink, { upsert: true, new: true });
    return res.json({ success: false, msg: "Link expiried" });
  }

  // check if email is the same as in database 
  // check if user email in database
  const user = (await User.find({ email: resetlink.email }))[0];

  if (!user || (user && (user.email !== resetlink.email))) {// TODO check of dit alles afvangt
    return res.json({ success: false, msg: "User not found" });
  }

  // get password and repeat password 
  let temp_user = user;
  if (result.value && result.value.password && (result.value.password == result.value.repeatPassword)) {
    let salt = authCtrl.genRandomString(16); /** Gives us salt of length 16 */
    let passwordData = authCtrl.sha512(result.value.password, salt);
    temp_user.nSalt = salt;
    temp_user.hashedPassword = bcrypt.hashSync(passwordData.passwordHash, 10);
  }

  // save to user database 
  await User.findByIdAndUpdate(temp_user._id, temp_user, { upsert: true, new: true });

  // update password reset link as being used 
  resetlink.active = true;
  await Passwordrst.findByIdAndUpdate(resetlink._id, resetlink, { upsert: true, new: true });

  return res.json({ success: true, msg: "Password updated" });
}
