import Product from "../models/Product.js";
import Post from "../models/Post.js"; // Import modelu Post
import * as aiService from "./aiService.js"; // Import serwisu AI
import Category from "../models/Category.js"; 
import slugify from "slugify";

const handleCategory = async (categoryName) => {
    if (!categoryName) throw new Error("Kategoria jest wymagana");
    
    const categorySlug = slugify(categoryName, { lower: true });

    const category = await Category.findOneAndUpdate(
        { slug: categorySlug },
        { name: categoryName, slug: categorySlug },
        { upsert: true, new: true }
    );
    return category._id;
};

export const getAllCategories = async () => {
    return await Category.find({}).sort({ name: 1 });
};

export const suggestPostsForProduct = async (name, description) => {
    //Pobieranie wszystkich postów (potrzebne jako kontekst dla AI)
    const allPosts = await Post.find({}, 'title description _id');

    if (allPosts.length === 0) return [];

    const suggestedIds = await aiService.suggestPostsForProduct(name, description, allPosts);
    
    return suggestedIds;
};

export const getAllProducts = async (keyword = '') => {
    // Można tu dodać wyszukiwanie po nazwie w przyszłości
    // const query = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};
    return await Product.find().populate("category");;
};

export const getProductBySlugOrId = async (identifier) => {
    const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);

    if (isObjectId) {
        return await Product.findById(identifier).populate("category").populate('relatedPosts');;
    } else {
        return await Product.findOne({ slug: identifier }).populate("category").populate('relatedPosts');;
    }
};

export const createProduct = async (productData) => {
    const slug = slugify(productData.name, { lower: true, strict: true });
    const categoryId = await handleCategory(productData.category);

    const product = new Product({
        ...productData,
        slug: slug,
        category: categoryId 
    });
    return await product.save();
};

export const updateProduct = async (id, updateData) => {
    if (updateData.name) {
        updateData.slug = slugify(updateData.name, { lower: true, strict: true });
    }
    
    if (updateData.category) {
        updateData.category = await handleCategory(updateData.category);
    }
    return await Product.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};