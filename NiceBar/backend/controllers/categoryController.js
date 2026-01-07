import Category from "../models/Category.js";
import slugify from "slugify";

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ createdAt: -1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Błąd pobierania kategorii" });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // 1. Walidacja nazwy
        if (!name) {
            return res.status(400).json({ message: "Nazwa kategorii jest wymagana" });
        }

        // 2. Sprawdzenie duplikatu
        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ message: "Taka kategoria już istnieje" });
        }

        // 3. Utworzenie kategorii Z RĘCZNYM SLUGIEM
        const category = await Category.create({ 
            name,
            slug: slugify(name, { lower: true, strict: true }) 
        });
        
        res.status(201).json(category);

    } catch (error) {
        console.error("Błąd tworzenia kategorii:", error);
        
        if (error.code === 11000) {
            return res.status(400).json({ message: "Kategoria o tej nazwie już istnieje" });
        }

        res.status(500).json({ message: "Błąd serwera przy dodawaniu kategorii" });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.findById(req.params.id);

        if (category) {
            category.name = name;
            // Slug zaktualizuje się automatycznie dzięki middleware w modelu (lub ręcznie tutaj)
            category.slug = slugify(name, { lower: true, strict: true });
            
            const updatedCategory = await category.save();
            res.json(updatedCategory);
        } else {
            res.status(404).json({ message: "Nie znaleziono kategorii" });
        }
    } catch (error) {
        res.status(500).json({ message: "Błąd edycji kategorii" });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: "Nie znaleziono" });
        res.json({ message: "Kategoria usunięta" });
    } catch (error) {
        res.status(500).json({ message: "Błąd usuwania" });
    }
};