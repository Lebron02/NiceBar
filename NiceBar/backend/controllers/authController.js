import bcrypt from "bcrypt";
import User from "../models/User.js";

export const register = async (req, res) => {
    const {email, password, firstName, lastName, address} = req.body;

    try {
        const exists = await User.findOne({email});

        if(exists){
            return res.status(400).json({message: "Użytkownik już istnieje"});
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({email, password: hashed, firstName, lastName, address});
        await user.save();

        res.status(201).json({message: "Użytkownik zarejstrowany"})
    } catch (error) {
        res.status(500).json({message: "Błąd serwera przy register"})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "Nieprawidłowy email"});
        }
        if(!(await bcrypt.compare(password, user.password))){
            return res.status(400).json({message: "Nieprawidłowe hasło"});
        }

        const userToSend = {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            createdAt: user.createdAt
            // (W przyszłości dodasz tu też 'address')
        };

        const userId = user._id
        req.session.userId = userId
    
        res.status(200).json({ message: "Sukces logowania!", user: userToSend})
        
    } catch (error) {
        res.status(500).json({message: "Błąd serwera przy login"})
    }
}

export const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if(err){
                res.status(500).json({ message: "Błąd wylowowania!" });
            } else {
                res.status(200).json({message: "Wylogowanie powiodło się!"});
            }
        })
    } catch (error) {
        res.status(500).json({message: "Błąd serwera przy logout"})
    }
}

export const checkStatus = async (req, res) => {
    try {
        if(req.session.userId){
            const userData = await User.findById(req.session.userId).select("-password");
            res.status(200).json({ isLoggedIn: true, user: userData})
        } else {
            res.status(401).json({ isLoggedIn: false})
        }
    } catch (error) {
        res.status(500).json({message: "Błąd serwera przy checkStatus"})
    }
}