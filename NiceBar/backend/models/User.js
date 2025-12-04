import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstName:{ type: String, required: true },
    lastName: { type: String, required: true },
    address: {
        streetName: { type: String },
        streetNumber: { type: String },
        city: { type: String },
        postalCode: { type: String}
    },
    password:{ type: String, required: true },
    role:{ 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user', 
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;

