import * as authService from "../services/authService.js";

export const register = async (req, res) => {
    try {
        const exists = await authService.registerUser(req.body)
        res.status(201).json({message: "Użytkownik zarejstrowany"})
    } catch (error) {
        const status = error.message === "Użytkownik już istnieje" ? 400 : 500;
        res.status(status).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await authService.loginUser( email, password );
        req.session.userId = user._id;

        const userToSend = user.toObject();
        delete userToSend.password;

        res.status(200).json({ message: "Sukces logowania!", user: userToSend})
    } catch (error) {
        console.error("Szczegóły błędu logowania:", error.message);
        if (error.message === "Nieprawidłowy email" || error.message === "Nieprawidłowe hasło") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Wystąpił błąd serwera podczas logowania" });
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
            const userData = await authService.getUserById(req.session.userId);
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
    const userId = req.session.userId;

    try {
        const user = await authService.changeUserPassword(userId, currentPassword, newPassword )
        res.status(200).json({ message: "Hasło zostało zmienione pomyślnie" });
    } catch (error) {
        const status = (error.message === "Obecne hasło jest nieprawidłowe") ? 400 : 500;
        res.status(status).json({ message: error.message });
    }
    };

export const updateAddress = async (req, res) => {
    try {
        const user = await authService.updateUserAddress(req.session.userId, req.body)

        const userToSend = user.toObject();
        delete userToSend.password;

        res.status(200).json({ message: "Adres zaktualizowany", user: userToSend });
    } catch (error) {
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
        const updatedUser = await authService.promoteUserToAdmin(req.session.userId);

        res.status(200).json({ 
            message: "Gratulacje! Zostałeś adminem.", 
            user: updatedUser 
        });

    } catch (error) {
        console.error("Błąd awansu:", error);
        res.status(500).json({ message: "Błąd serwera" });
    }
};