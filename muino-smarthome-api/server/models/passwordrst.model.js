const mongoose = require('mongoose');

const passwdRstSchema = new mongoose.Schema(
    {
        randomid: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            unique: false,
            required: true,
            // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
            match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
          },
        active: { // when true then it has been used
            type: Boolean,
            required: true
        },
        expireDate:{
            type:Date,
            default: () => new Date(+new Date() + 2*24*60*60*1000)
        }
    },
    {
        versionKey: false
    });

// The init of the scheme
module.exports = mongoose.model('passwdRstSchema', passwdRstSchema);

