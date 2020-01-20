/* Only init   */

'use strict';
const Joi = require('joi');
const Task = require('../../models/task.model');
const Project = require('../../models/project.model');
const mongoose = require('mongoose');


function objectId() { 
    return Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id');    
};

const taskSchema = Joi.object().keys({
    _id: objectId(),
    parrent: objectId().required(),
    status: Joi.string(),
    task_name: Joi.string().required(),
    description: Joi.string(), // .max(250, 'utf8'),
    time_start: Joi.date().timestamp(),
    time_stop: Joi.date().timestamp(),
    creater_id: objectId().required(),
    assigned: Joi.array().items(objectId()),
    clock_out_events: Joi.array().items(objectId()),
    sub_tasks: Joi.array().items(objectId())
})

module.exports = {
    task_create_post,
    task_update_put,
    task_delete,
    task_detail_get,
    task_list_get
}

async function task_create_post(req, res) {

    const result = Joi.validate(req.body, taskSchema);

    if (result.error) {
        res.status(400).json({ success: false, result: result.error.name });
        return;
    }

    let data_result = await new Task(result.value).save();

    // als dat goed ging moet de parrent een subtask erbij krijgen
    // Maar hoe weten we of het goed ging ? ? ? ? ? ? ?
    // console.log(data_result);


    var update = {
        $addToSet: { sub_tasks: [data_result._id] }
    }
    let temp = await Project.findByIdAndUpdate(result.value.parrent, update);
    console.log(temp);
    return res.json(data_result);
};


async function task_update_put(req, res) {
    const result = Joi.validate(req.body, taskSchema);

    if (result.error) {
        return res.json({ success: false, result: result.error.name }); // TODO .name
    }

    const updated_task = await Task.findByIdAndUpdate(result.value._id, result.value, { new: true });// new for update return
    return res.json({ updated_task });
};

async function task_delete(req, res) {
    // check if project has same id as name
    let removed_object = await Task.findByIdAndRemove(req.params.id);
    // remove from parrent id 

    var condition = {
        sub_tasks:  mongoose.Types.ObjectId(req.params.id)
    }
     
    var update = {
        $pull: { sub_tasks:  mongoose.Types.ObjectId(req.params.id) }
    }
 
    let temp1 = await Project.findOneAndUpdate(condition, update);
    let temp2 = await Task.findOneAndUpdate(condition, update);
    console.log(temp1, temp2);


    return res.json({ removed_object });
};

async function task_detail_get(req, res) {
    // To do     
    console.log( req.params.id );
    
    let taskDetails = await Task.findById( req.params.id); // params.id -> getting from url
    return res.json({success: true, taskDetails});
};

async function task_list_get(req, res) {
    let task_list = await Task.find({});
    return res.json({success: true, task_list});
};