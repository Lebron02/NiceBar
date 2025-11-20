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

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Wszystkie pola są wymagane" });
    }

    try {
        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.status(404).json({ message: "Użytkownik nie znaleziony" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Obecne hasło jest nieprawidłowe" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Hasło zostało zmienione pomyślnie" });

    } catch (error) {
        console.error("Błąd zmiany hasła:", error);
        res.status(500).json({ message: "Błąd serwera przy zmianie hasła" });
    }
    };

export const updateAddress = async (req, res) => {
    const { streetName, streetNumber, city, postalCode } = req.body;

    try {
        const user = await User.findById(req.session.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "Użytkownik nie znaleziony" });
        }

        user.address = {
            streetName,
            streetNumber,
            city,
            postalCode
        };
        await user.save();

        res.status(200).json({ 
            message: "Adres zaktualizowany", 
            user: user 
        });

    } catch (error) {
        console.error("Błąd zmiany adresu:", error);
        res.status(500).json({ message: "Błąd serwera przy zmianie adresu" });
    }
};

export const promoteToAdmin = async (req, res) => {
    const { secretCode } = req.body;

    if (!secretCode) {
        return res.status(400).json({ message: "Podaj kod!" });
    }

    if (secretCode !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json({ message: "Nieprawidłowy kod autoryzacyjny" });
    }

    try {
        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.status(404).json({ message: "Użytkownik nie znaleziony" });
        }

        user.role = 'admin';
        await user.save();

        const userToSend = user.toObject();
        delete userToSend.password;

        res.status(200).json({ 
            message: "Gratulacje! Zostałeś adminem.", 
            user: userToSend 
        });

    } catch (error) {
        console.error("Błąd awansu:", error);
        res.status(500).json({ message: "Błąd serwera" });
    }
};