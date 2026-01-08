import Post from "../models/Post.js";
import Product from "../models/Product.js"; 
import * as aiService from "./aiService.js";

import slugify from "slugify";

export const createPost = async (postData, userId) => {
    const { title, description, images, products } = postData;
    const slug = slugify(postData.title, { lower: true, strict: true });
    
    const post = new Post({
        title,
        slug: slug,
        description,
        images,      
        products,   
        userId
    });

    return await post.save();
};

export const getAllPosts = async () => {
    return await Post.find({})
        .populate("userId", "firstName lastName")
        .sort({ createdAt: -1 }); 
};

export const getPostBySlugOrId = async (identifier) => {
    const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);

    if (isObjectId) {
        return await Post.findById(identifier)
        .populate("userId", "firstName lastName")
        .populate("comments.author", "firstName lastName")
        .populate("products")
    } else {
        return await Post.findOne({ slug: identifier })
        .populate("userId", "firstName lastName")
        .populate("comments.author", "firstName lastName")
        .populate("products")
    }
};

// ZMODYFIKOWANE: Obsługa isAdmin
export const updatePost = async (id, userId, updateData, isAdmin = false) => {
    if (updateData.title) {
        updateData.slug = slugify(updateData.title, { lower: true, strict: true });
    }
    
    const query = isAdmin ? { _id: id } : { _id: id, userId: userId };

    return await Post.findOneAndUpdate(
        query,
        updateData, 
        { new: true }
    );
};

// ZMODYFIKOWANE: Obsługa isAdmin
export const deletePost = async (id, userId, isAdmin = false) => {
    const query = isAdmin ? { _id: id } : { _id: id, userId: userId };
    return await Post.findOneAndDelete(query);
};

export const addComment = async (postId, userId, text) => {
    return await Post.findByIdAndUpdate(
        postId,
        {
            $push: {
                comments: { author: userId, text: text }
            }
        },
        { new: true }
    ).populate("comments.author", "firstName lastName");
};

// ZMODYFIKOWANE: Obsługa isAdmin przy usuwaniu komentarza
export const deleteComment = async (id, commentId, userId, isAdmin = false) => {
    // Jeśli admin -> usuń komentarz o danym ID niezależnie od autora
    // Jeśli user -> usuń komentarz o danym ID TYLKO jeśli autor się zgadza
    const pullQuery = isAdmin 
        ? { _id: commentId } 
        : { _id: commentId, author: userId };

    return await Post.findByIdAndUpdate(
        id,
        {
            $pull: {
                comments: pullQuery
            }
        },
        { new: true }
    )
};

export const getAiProductSuggestions = async (title, content) => {
    const allProducts = await Product.find({}, 'name category _id brand');
    
    if (!allProducts.length) return [];

    const suggestedIds = await aiService.suggestProductsForPost(title, content, allProducts);

    return suggestedIds;
};