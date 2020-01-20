'use strict';
const express = require('express');
const warningCtrl = require('../controllers/warning.controller');
const passport = require('passport');
const exist_role = require('../middleware/shared_functions')

const router = express.Router();
module.exports = router;


// router.post('/setwarning',passport.authenticate('jwt', { session: false }), setwarning); //  
router.get('/getwarning', passport.authenticate('jwt', { session: false }), getwarning);


async function getwarning(req, res) {
    let data;

    let count = 50;
    if (req.body.count)
        count = req.body.count;

    data = await warningCtrl.getWarning(count);

    return res.json({ data });
}

// async function setwarning(req, res) {
//     /* ToDo: Not working*/
//     let data;

//     if (!exist_role(req.user, 'warning')) {
//         console.log("oeps geen warning [setwarning]", req.user);
//         res.json({ error: true });
//     }
//     data = await warningCtrl.setWarning('l.l');
//     return res.json({ error: false, data });
// }