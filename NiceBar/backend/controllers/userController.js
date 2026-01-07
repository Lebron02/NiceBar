import * as userService from "../services/userService.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error("Błąd w userController:", error); 
        res.status(500).json({ message: "Błąd pobierania użytkowników" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await userService.deleteUser(req.params.id);
        if (!user) return res.status(404).json({ message: "Użytkownik nie znaleziony" });
        res.json({ message: "Produkt usunięty" });
    } catch (error) {
        console.error("Błąd w userController:", error); 
        res.status(500).json({ message: "Błąd usuwania użytkownika" });
    }
};