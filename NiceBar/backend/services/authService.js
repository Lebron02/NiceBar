import User from "../models/User.js";
import bcrypt from "bcrypt";

export const registerUser = async (userData) => {
    const { email, password, firstName, lastName, address } = userData;

    const exists = await User.findOne({ email });
    if (exists) {
        throw new Error("Użytkownik już istnieje");
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
        email,
        password: hashed,
        firstName,
        lastName,
        address
    });

    return await user.save();
};

export const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Nieprawidłowy email");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Nieprawidłowe hasło");
    }

    return user;
};

export const getUserById = async (id) => {
    return await User.findById(id).select("-password");
};

export const updateUserAddress = async (userId, addressData) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("Nie znaleziono użytkownika");

    user.address = addressData;
    return await user.save();
};

export const promoteUserToAdmin = async (userId) => {
    return await User.findByIdAndUpdate(userId, { role: 'admin' }, { new: true }).select("-password");
}

export const changeUserPassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("Użytkownik nie znaleziony");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error("Obecne hasło jest nieprawidłowe");

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    return await user.save();
};