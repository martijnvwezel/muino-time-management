'use strict';

const Joi = require('joi');
const Warning_data = require('../models/warning.model');
const exist_role = require('../middleware/shared_functions')

const warningScheme = Joi.object({
    source: Joi.string(),
    type: Joi.string(),
    causedBy: Joi.string(),
    extra: Joi.string(),
    seen: Joi.string()
})



module.exports = {
    saveWarning,
    getWarning,
    setWarning
}

async function saveWarning(warning) {
    /* untested */

    // if (!exist_role(req.user, 'warning')) {
    //     console.log("oeps geen warning [users]",req.user);
    //     res.json({ 'error': 'no-permissions' });
    //     return;
    //   }
    warning = await Joi.validate(warning, warningScheme, { abortEarly: false });
    return await new Warning_data(warning).save();
}

async function getWarning( count ) {
    /* untested */

    let jsondata; 
    try{
        jsondata = await Warning_data.find({}, null, { limit: count, sort: { 'createdAt': -1 } });
    }catch(e){
        console.log(e);
       
    }
    return jsondata;
}

async function setWarning( lala ) {    
    /* untested */

    let jsondata = {}; 
   
    return jsondata;
}

