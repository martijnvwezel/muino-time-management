const mongoose = require('mongoose');

const WarningSchema = new mongoose.Schema(
    {
        source: {
            type: String
        },
        type: {
            type: String

        },
        causedBy: {
            type: String

        },
        seen: {
            type: Boolean
        },
        extra: [{
            type: String
        }],
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        versionKey: false
    });

// The init of the scheme
module.exports = mongoose.model('Warning_data', WarningSchema);
