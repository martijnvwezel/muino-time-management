const mongoose = require('mongoose');

const tasksSchema = new mongoose.Schema(
    {
        parrent: Object,
        status: String,
        task_name: String,
        description: String,
        time_start: Date,
        time_stop: Date,
        creater_id: Object,
        assigned: [Object],
        clock_out_events: [Object],
        sub_tasks: [Object],
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        versionKey: false
    });

// The init of the scheme
module.exports = mongoose.model('tasks', tasksSchema);

