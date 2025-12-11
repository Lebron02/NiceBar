import * as productService from "../services/productService.js";

export const getProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts(req.query.keyword);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Błąd pobierania produktów" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductBySlugOrId(req.params.id);
        if (!product) return res.status(404).json({ message: "Produkt nie znaleziony" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Błąd serwera" });
    }
};

export const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: "Błąd tworzenia produktu" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        if (!product) return res.status(404).json({ message: "Produkt nie znaleziony" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Błąd aktualizacji" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await productService.deleteProduct(req.params.id);
        if (!product) return res.status(404).json({ message: "Produkt nie znaleziony" });
        res.json({ message: "Produkt usunięty" });
    } catch (error) {
        res.status(500).json({ message: "Błąd usuwania" });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await productService.getAllCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Błąd pobierania kategorii" });
    }
};

export const getAiSuggestedPosts = async (req, res) => {
    const { name, description } = req.body;
    
    if (!name && !description) {
        return res.status(400).json({ message: "Wymagana nazwa lub opis produktu" });
    }

    try {
        const suggestedPostIds = await productService.suggestPostsForProduct(name, description);
        res.json({ suggestedPostIds });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Błąd generowania sugestii AI" });
    }
};