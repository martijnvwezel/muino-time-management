

/* Only init   */

'use strict';
const Joi = require('joi');
const Task = require('../../models/task.model');
const Project = require('../../models/project.model');
const Event = require('../../models/event.model');
const User = require('../../models/user.model');
const mongoose = require('mongoose');





function objectId() {
    return Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id');
};

const reportSchema = Joi.object().keys({
    template: Joi.array().items(Joi.string()),
    years: Joi.array().items(Joi.string()),
    assigned: Joi.array().items(Joi.string())
})

module.exports = {
    report_post
}


/**
 * @brief  Convert project,user,year from database to readable user data 
 * @param year array of years where only to the first position is been looked at
 * @param user array of users that are being find on the project that where active then 
 * @param template the type of output template, this is ignored for now
 * @retval event to project/tasks where eacht event has some extra properties
 */
async function report_post(req, res) {

    const result = Joi.validate(req.body, reportSchema);

    if (result.error) {
        return res.status(400).json({ success: false, result: result.error.name });
    }

    if (req.user && !(req.user.roles.indexOf("admin") > -1) ){
        if(result.value.assigned.length !== 1  ||  result.value.assigned[0] !==  String(req.user._id) ){ // TODO check for security vulnarbility
            return res.json({ success: false, result: "No premissions"});
        }
    }


    let year = result.value.years[0];
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
                "_id": 0,
                "project_name": 1,
                "time_start": 1,
                "time_due": 1,
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
                    "_id": 0,
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
                            "user_id": { "$in": result.value.assigned }
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
                            "week": { $sum: [{ $week: "$time_start" }, 1] },
                            "hour": { $divide: [{ $subtract: ['$time_stop', '$time_start'] }, 1000 * 60 * 60] },
                            "minut": { $minute: { date: "$time_stop" } },
                            "comment": 1,
                            "groupid": 1,
                            "time_stop": 1 // ((new Date("$time_stop")).getDay() )// new Date("$time_stop").getDay()
                        }
                    }
                    //,
                    // {
                    //     $group: {// group if user and week is the samen and sum the hours together
                    //         "_id": { user_id: "$user_id", week: "$week" },
                    //         hours: { $sum: "$hour" },
                    //         minuts: { $sum: "$minut" }
                    //     }
                    // },
                    // {
                    //     $project: { // clear up the aggregation
                    //         "_id": 0,
                    //         "user_id": "$_id.user_id",
                    //         "week": "$_id.week",
                    //         "hours": { $sum: ["$hours", { $divide: ["$minuts", 60] }] }
                    //     }
                    // }
                ]);
            }
        }
    }

    // * Get users list 
    // let user_list = [];
    // for (let i = 0; i < user_assigned_project.length; i++) {
    //     for (let j = 0; j < user_assigned_project[i].sub_tasks.length; j++) {
    //         if (user_assigned_project[i].sub_tasks[j].clock_out_events) {

    //             for (let k = 0; k < user_assigned_project[i].sub_tasks[j].clock_out_events.length; k++) {
    //                 if (user_assigned_project[i].sub_tasks[j].clock_out_events[k].user_id) {
    //                     user_list.push(user_assigned_project[i].sub_tasks[j].clock_out_events[k].user_id);
    //                 }
    //             }
    //         }
    //     }
    // }


    // user_list = user_list.filter((value, index, self) => (self.indexOf(value) === index));

    // let user_ids_list = await User.aggregate([
    //     {
    //         $match: {
    //             "_id": { "$in": user_list.map(mongoose.Types.ObjectId) }
    //         }
    //     },
    //     {
    //         $project: {
    //             "_id": 1,
    //             "username": 1,
    //             "hour_rate": 1
    //         }
    //     },
    // ]);

    console.timeEnd("timer_accounting_user_get"); // +31ms

    const accounting_info = {
        // clock_events: clock_events,
        user_assigned_project: user_assigned_project,
        // project_id: project_id,
        user_list: [],
        success: true

    }

    return res.json(accounting_info);

};
