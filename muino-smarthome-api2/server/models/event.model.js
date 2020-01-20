const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        user_id: Object,
        task_id: Object,
        time_start: Date,
        time_stop: Date,
        comment: String,
        groupid: String
    },
    {
        versionKey: false
    });

// The init of the scheme
module.exports = mongoose.model('event', eventSchema);

