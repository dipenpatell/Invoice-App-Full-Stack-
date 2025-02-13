const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        trim: true,
        minLength: 3
    },
    userid: String,
    password: String,
    role: {
        type: String,
        default: "user"
    },
    invoices: {
        type: Array,
        default: []
    },
});

module.exports = mongoose.model("user", userSchema);