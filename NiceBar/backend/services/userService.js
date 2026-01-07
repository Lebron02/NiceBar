import User from "../models/User.js";

export const getAllUsers = async () => {
    return await User.find({}).select("-password");
};

export const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};