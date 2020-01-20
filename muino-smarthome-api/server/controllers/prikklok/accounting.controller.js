/* Only init   */

'use strict';
const Joi = require('joi');
const User = require('../../models/user.model');
const Project = require('../../models/project.model');
const Task = require('../../models/task.model');
const Event = require('../../models/event.model');


const mongoose = require('mongoose');

function objectId() {
    return Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id');
};

const projectSchema = Joi.object().keys({
    _id: objectId(),// objectId
    project_name: Joi.string().required().max(250, 'utf8'),
    project_customer: Joi.string(),
    description: Joi.string(),//.max(250, 'utf8'),// just like gitlab
    status: Joi.string(),
    private: Joi.boolean(), // Default set to false in mongoose part
    time_start: Joi.date().timestamp(),
    time_due: Joi.date().timestamp(),
    creater_id: Joi.string().required(),// objectId
    assigned: Joi.array().items(Joi.string(), objectId()),
    sub_tasks: Joi.array().items(Joi.string(), objectId()),
    costs: Joi.number()
})

const accountingGetSchema = Joi.object().keys({
    private: Joi.boolean().default(true), // Default set to true, for getting also private projects
    time_start: Joi.date().timestamp(),
    time_due: Joi.date().timestamp(),
    status: Joi.string()
})



module.exports = {
    project_create_post,
    accounting_overview_post,
    accounting_projects_get,
    accounting_project_info_get
}

async function project_create_post(req, res) {


    const result = Joi.validate(req.body, projectSchema);

    if (result.error) {
        return res.status(400).json({ result: result.error.name, success: false });
    }

    // insert project in database

    var data = req.body;
    let array = [];
    for (let k in data.assigned) {
        if (!(data.assigned[k] in data.assigned)) {
            array.push(String(data.assigned[k])); // mongoose.Types.ObjectId()
        }
    }

    data.assigned = array;

    let data_result;
    try {
        data_result = await new Project(data).save();
    } catch (error) {
        return res.status(400).json({ error: error })
    }

    return res.json({ data_result });
}


/**
 * @brief Get project list with their IDs 
 * @param None
 * @retval array with jsons if success
 */
async function accounting_projects_get(req, res) {
    var _id = req.user._id;

    console.log(_id);

    let year = new Date(req.params.id).getFullYear();
    let year_end = new Date(year + 1, 0, 1);
    let year_start = new Date(year, 0, 1);

    if (!(req.user.roles.includes("admin"))) { // TODO fix that this is new user premission
        return res.json({ error: "No premission", success: true });
    }

    let user_assigned_projects = await Project.aggregate([
        {
            $match: {
                $and: [
                    {
                        $or: [{ "time_start": { $lt: year_end } },
                        { "time_start": { $exists: false } }]
                    },
                    {
                        $or: [{ "time_due": { $gt: year_start } },
                        { "time_due": { $exists: false } }]
                    }
                ]
            }
        },
        {
            $project: {
                "_id": 1,
                "project_name": 1
            }
        }
    ]);
    // console.log(user_assigned_projects);

    user_assigned_projects.success = true;
    return res.json(user_assigned_projects);
}



/**
 * @brief Get project list that is active in the given
 * @param None
 * @retval array with jsons if success
 */
async function accounting_project_info_get(req, res) {


    if (!(req.user.roles.includes("admin"))) { // TODO fix that this is new user premission
        return res.json({ error: "No premission", success: true });
    }

    let project_id = req.params.id

    let user_assigned_project = await Project.aggregate([
        {
            $match: {
                "_id": { "$eq": mongoose.Types.ObjectId(project_id) }
            }
        },
        {
            $project: {
                "_id": 1,
                "project_name": 1,
                "sub_tasks": 1
            }
        },
    ]);

    let user_assigned_tasks = await Task.aggregate([
        {
            $match: {
                "_id": { "$in": user_assigned_project[0].sub_tasks.map(mongoose.Types.ObjectId) }
            }
        },
        {
            $project: {
                "_id": 1,
                "task_name": 1,
                "clock_out_events": 1
            }
        },
    ]);

    // * Get the clock out event with their week number
    for (let index = 0; index < user_assigned_tasks.length; index++) {

        user_assigned_tasks[index].clock_out_events = await Event.aggregate([
            {
                $match: {
                    "_id": { "$in": user_assigned_tasks[index].clock_out_events.map(mongoose.Types.ObjectId) }
                }
            },
            {
                $project: {
                    "_id": 0,
                    // "time_start": 1, 
                    // "time_stop": 1,
                    // "user_id":1,
                    "week": { $week: "$time_start" },
                    "hour": { $sum: [{ $hour: { date: "$time_stop", timezone: "+0100" } }, 1] },
                }
            },
        ]);

    }




    for (let index = 0; index < user_assigned_tasks.length; index++) {

        let events = user_assigned_tasks[index].clock_out_events;
        let clock_events = {};

        for (let j = 0; j < events.length; j++) {
            let week = events[j].week;
            if ((week + 1) in clock_events) {
                clock_events[week + 1] += events[j].hour;
            } else {
                clock_events[week + 1] = events[j].hour;
            }
        }
        user_assigned_tasks[index].clock_out_events = clock_events;


    }


    const accounting_info = {
        sub_tasks: user_assigned_tasks,
        project_id: project_id,
        success: true

    }

    return res.json(accounting_info);
}



/**
 * @brief Return for each user the work hours for each week [unfinished]
 * @param None
 * @retval array with jsons if success
 */

async function accounting_overview_post_old(req, res) {
    // check on user and on date 

    const result = Joi.validate(req.body, accountingGetSchema);

    if (result.error) {
        return res.status(400).json({ result: result.error, success: false });
    }


    if (!(req.user.roles.includes("admin"))) { // TODO fix that this is new user premission
        return res.json({ error: "No premission", success: true });
    }


    let user_assigned_project = await Project.aggregate([
        // {
        //     $match: {
        //         "_id": { "$eq": mongoose.Types.ObjectId(project_id) }
        //     }
        // },
        {
            $project: {
                "_id": 1,
                "project_name": 1,
                "sub_tasks": 1
            }
        },
    ]);

    let user_assigned_tasks = await Task.aggregate([
        {
            $match: {
                "_id": { "$in": user_assigned_project[0].sub_tasks.map(mongoose.Types.ObjectId) }
            }
        },
        {
            $project: {
                "_id": 1,
                "task_name": 1,
                "clock_out_events": 1
            }
        },
    ]);

    // * Get the clock out event with their week number
    for (let index = 0; index < user_assigned_tasks.length; index++) {

        user_assigned_tasks[index].clock_out_events = await Event.aggregate([
            {
                $match: {
                    "_id": { "$in": user_assigned_tasks[index].clock_out_events.map(mongoose.Types.ObjectId) }
                }
            },
            {
                $project: {
                    "_id": 0,
                    // "time_start": 1, 
                    // "time_stop": 1,
                    "user_id": 1,
                    "week": { $week: "$time_start" },

                    "hour": { $sum: [{ $hour: { date: "$time_stop", timezone: "+0100" } }, 1] },
                }
            },
        ]);

    }



    let clock_events = {};
    for (let index = 0; index < user_assigned_tasks.length; index++) {

        let events = user_assigned_tasks[index].clock_out_events;


        for (let j = 0; j < events.length; j++) {
            let week = events[j].week + 1;
            let user_id = events[j].user_id;


            if (!(user_id in clock_events)) {
                clock_events[user_id] = {};
            }



            if (week in clock_events[user_id]) {
                clock_events[user_id][week] += events[j].hour;
            } else {
                clock_events[user_id][week] = events[j].hour;
            }
        }
    }

    const accounting_info = {
        clock_events: clock_events,
        // project_id: project_id,
        success: true

    }

    return res.json(accounting_info);


}




/**
 * @brief Return for each user the work hours for each week
 * @param None
 * @retval array with jsons if success
 */
async function accounting_overview_post(req, res) {

    const result = Joi.validate(req.body, accountingGetSchema);

    if (result.error) {
        return res.status(400).json({ result: result.error, success: false });
    }


    if (!(req.user.roles.includes("admin"))) { // TODO fix that this is new user premission
        return res.json({ error: "No premission", success: true });
    }
    console.time("timer_accounting_user_get");



    // $gte: greater to equal, 0 means januari
    // $lte: lower to equal, 0 means januari

    let year = new Date(req.body.time_start).getFullYear();
    let year_end = new Date(year + 1, 0, 1);
    let year_start = new Date(year, 0, 1);
  
    let user_assigned_project = await Project.aggregate([
        {
            $match: {
                $and: [
                    {
                        $or: [{ "time_start": { $lt: year_end } },
                        { "time_start": { $exists: false } }]
                    },
                    {
                        $or: [{ "time_due": { $gt: year_start } },
                        { "time_due": { $exists: false } }]
                    }
                ]
            }
        },
        {
            $project: {
                "_id": 1,
                "project_name": 1,
                "budget": 1,
                "time_start": 1,
                "time_due": 1,
                "status": 1,
                "sub_tasks": 1
            }
        },
    ]);





    for (let index = 0; index < user_assigned_project.length; index++) {

        user_assigned_project[index].sub_tasks = await Task.aggregate([
            {
                $match: {
                    "_id": { "$in": user_assigned_project[index].sub_tasks.map(mongoose.Types.ObjectId) }
                }
            },
            {
                $project: {
                    "_id": 1,
                    "task_name": 1,
                    "clock_out_events": 1
                }
            },
        ]);


        // console.log(user_assigned_project);
        // console.log(new Date(year, 0, 1));

        // "hour": { $sum: [{ $divide: [{$subtract:["$time_stop", "$time_start"]},36000000 ]}, 1] },

        // * Get the clock out event with their week number

        for (let j = 0; j < user_assigned_project[index].sub_tasks.length; j++) {
            if (user_assigned_project[index].sub_tasks[j] && user_assigned_project[index].sub_tasks[j].clock_out_events) {
                user_assigned_project[index].sub_tasks[j].clock_out_events = await Event.aggregate([
                    {
                        $match: { // Got events with the IDs
                            "_id": { "$in": user_assigned_project[index].sub_tasks[j].clock_out_events.map(mongoose.Types.ObjectId) }
                        }
                    },
                    {
                        $match: {
                            "time_start": {
                                $gte: new Date(year, 0, 1),  // $gte: greater to equal, 0 means januari
                                $lt: new Date(year + 1, 0, 1)  // $lte: lower to equal
                            }
                        }
                    },
                    {
                        $project: { // make the object and get the week and hours of the event
                            "_id": 0,
                            "user_id": 1,
                            "week":  { $sum: [{ $week: "$time_start" }, 1] },
                            "hour": { $divide: [{ $subtract: ['$time_stop', '$time_start'] }, 1000 * 60 * 60] },
                            // ! "hour_old": { $sum: [{$hour:{ date: "$time_stop", timezone: "+0100" }}, 1] },
                            "minut": { $minute: { date: "$time_stop"  } },
                            "time_stop":1,
                        }
                    },
                    {
                        $group: {// group if user and week is the samen and sum the hours together
                            "_id": { user_id: "$user_id", week: "$week" },
                            hours: { $sum: "$hour" },
                            minuts: { $sum: "$minut" }
                        }
                    },
                    {
                        $project: { // clear up the aggregation
                            "_id": 0,
                            "user_id": "$_id.user_id",
                            "week": "$_id.week",
                            "hours": { $sum: ["$hours", { $divide: ["$minuts", 60] }] }}
                    }
                ]);
            }
        }
    }


    // * Get users list 
    let user_list = [];
    for (let i = 0; i < user_assigned_project.length; i++) {
        for (let j = 0; j < user_assigned_project[i].sub_tasks.length; j++) {
            if (user_assigned_project[i].sub_tasks[j].clock_out_events) {

                for (let k = 0; k < user_assigned_project[i].sub_tasks[j].clock_out_events.length; k++) {
                    if (user_assigned_project[i].sub_tasks[j].clock_out_events[k].user_id) {
                        user_list.push(user_assigned_project[i].sub_tasks[j].clock_out_events[k].user_id);
                    }
                }
            }
        }
    }


    user_list = user_list.filter((value, index, self) => (self.indexOf(value) === index));

    let user_ids_list = await User.aggregate([
        {
            $match: {
                "_id": { "$in": user_list.map(mongoose.Types.ObjectId) }
            }
        },
        {
            $project: {
                "_id": 1,
                "username": 1,
                "hour_rate": 1
            }
        },
    ]);

    console.timeEnd("timer_accounting_user_get"); // +31ms

    const accounting_info = {
        // clock_events: clock_events,
        user_assigned_project: user_assigned_project,
        // project_id: project_id,
        user_list: user_ids_list,
        success: true

    }

    return res.json(accounting_info);
}