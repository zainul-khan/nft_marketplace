const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: [
        {
            type: String,
            required: true
        }
    ],
    reset_token: {
        type: String,
        required: false
    },
    is_active: { type: Boolean, 
        default: true 
    },
},{
    timestamps: true
});

const User = mongoose.model("User", UserSchema)
module.exports = User