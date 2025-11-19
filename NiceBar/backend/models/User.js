import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    address: {
        streetName: {
            type: String,
            required: true,
        },
        streetNumber: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        }
    },
    password:{
            type: String,
            required: true,
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user', 
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;

