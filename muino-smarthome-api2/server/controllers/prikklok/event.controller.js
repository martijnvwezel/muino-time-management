'use strict';
const Joi = require('joi');
const Event = require('../../models/event.model');
const Task = require('../../models/task.model');
const mongoose = require('mongoose');

function objectId() {
    return Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id');
};

const eventSchema = Joi.object().keys({
    user_id: objectId(),
    task_id: objectId(),
    time_start: Joi.date().timestamp(),
    time_stop: Joi.date().timestamp(),
    comment: Joi.string().max(140, 'utf8'), // Developt security implementation
    groupid: Joi.string().max(36, 'utf8')
})


const eventSchemaarray = Joi.array().items(Joi.object().keys({
    user_id: objectId(),
    task_id: objectId(),
    time_start: Joi.date().timestamp(),
    time_stop: Joi.date().timestamp(),
    comment: Joi.string().max(140, 'utf8'), // Developt security implementation
    groupid: Joi.string()
}))


const getEventSchema = Joi.object().keys({
    user_id: objectId(),
    time_start: Joi.date().timestamp(),
    time_stop: Joi.date().timestamp()
})


module.exports = {
    event_create_post,
    event_update_put,
    event_delete,
    event_detail_get,
    event_list_get,
    get_event_post
}



async function get_event_post(req, res) {
    // TODO make this working 

    const result = Joi.validate(req.body, getEventSchema);
    //check on dublicate, missing
    // console.log(result.value);


    if (result.error) {
        res.status(400).json({ result: result.error });
        return;
    }
    // TODO aggregrate function untested
    var user_assigned_projects = await Event.aggregate([
        {
            $match: {
                user_id: result.value.user_id,
                time_start: { $gte: result.value.time_start, $lt: result.value.time_stop }
            }

        },

    ]);

    // console.log(user_assigned_projects);


    return res.json(user_assigned_projects);
};


async function event_create_post(req, res) {
    // TODO check if not dublicated start dates maybe in mongoose 
    // TODO check if user is user he writes for [security]

    const result = Joi.validate(req.body, eventSchemaarray);


    //check on dublicate, missing
    // console.log(result.value);

    if (result.error) {
        res.status(400).json({ result: result.error });
        return;
    }

    var data_result = [];
    // insert event in database
    for (let element of result.value) {
        if (new Date(element.time_start).getTime() !== new Date(element.time_stop).getTime()) {

            let saved_element = await new Event(element).save();
            data_result.push(saved_element);

            let update = {
                $addToSet: { clock_out_events: [saved_element._id] }
            };
             await Task.findByIdAndUpdate(saved_element.task_id, update);


        } else {
            console.log("time is not created");
        }
    }

    // console.log(data_result);

    return res.json(data_result);
};


async function event_update_put(req, res) {
    // TODO correct event list clock out events 
    const result = Joi.validate(req.body, eventSchema);

    // console.log("id: ", );

    if (result.error) {
        res.status(400).json({ result: result.error.value });
        return;
    }

    let resultvalue = result.value;
    let updated_event = {};
    


    // * convert first to date object saves issues with string dates and ms dates
    if (new Date(resultvalue.time_start).getTime() === new Date(resultvalue.time_stop).getTime()) {
        updated_event = await Event.findByIdAndRemove(req.params.id); // when zero time diff remove

        let update = {
            $pull: { clock_out_events: updated_event._id }  // REMOVE REMOVE REMOVE 
        }

        await Task.findByIdAndUpdate(updated_event.task_id, update);

        console.log("deleted ", updated_event);
    }
    else {
        // console.log("result : ",result.value);
        const dbEvent= await Event.findById(req.params.id); // ! always before the update
        updated_event = await Event.findByIdAndUpdate(req.params.id, result.value, { new: true });// new for update return


        // * The following part is for updating the clock events
        
        // console.log("dbEvent: ",dbEvent);
        // console.log("result.value: ",result.value);
        
        if(dbEvent && dbEvent.task_id){
            if( dbEvent.task_id !== result.value.task_id){
                console.log("FOUNDED DIFF TASKID");
                // REMOVE FROM TASK ID 
                let update_remove = {
                    $pull: { clock_out_events: dbEvent._id }  // REMOVE REMOVE REMOVE 
                };
            
                 await Task.findByIdAndUpdate(dbEvent.task_id, update_remove);

                //ADD TO TASK ID 
                let update = {
                    $addToSet: { clock_out_events: [dbEvent._id] }
                };
                 await Task.findByIdAndUpdate(result.value.task_id, update);
                
            }
            else{
                console.log( dbEvent.task_id,"------",result.value.task_id);
            }

        }
        
    }

    return res.json(updated_event);
};

async function event_delete(req, res) {
    // check if project has same id as name

    let removed_object = await Event.findByIdAndRemove(req.body._id);

    let update = {
        $pull: { clock_out_events: removed_object._id }  // REMOVE REMOVE REMOVE 
    }

    await Task.findByIdAndUpdate(removed_object.task_id, update);

    return res.json({ removed_object });
};

async function event_detail_get(req, res) {
    // To do 
    let jsondata = await Event.find({ task_id: req.params.id });// params.id -> getting from url
    return res.json(jsondata);
};

async function event_list_get(req, res) {
    let event_list = await Event.find({});
    return res.json(event_list);
};