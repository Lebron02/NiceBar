import User from "../models/User.js";

const adminAuth = async (req, res, next) => {
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "Nie jesteś zalogowany" });
    }

    try {
        const user = await User.findById(req.user.userId);

        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: "Brak uprawnień administratora. Dostęp zabroniony." });
        }
    } catch (error) {
        res.status(500).json({ message: "Błąd serwera podczas weryfikacji uprawnień" });
    }
};

export default adminAuth;