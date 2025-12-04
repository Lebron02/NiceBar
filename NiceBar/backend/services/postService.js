import Post from "../models/Post.js";
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
        .populate("products");
    } else {
        return await Post.findOne({ slug: identifier })
        .populate("userId", "firstName lastName")
        .populate("comments.author", "firstName lastName")
        .populate("products");
    }
};

export const updatePost = async (id, userId, updateData) => {
    if (updateData.title) {
        updateData.slug = slugify(updateData.title, { lower: true, strict: true });
    }
    return await Post.findOneAndUpdate(
        { _id: id, userId: userId },
        updateData, 
        { new: true }
    );
};

export const deletePost = async (id, userId) => {
    return await Post.findOneAndDelete({ _id: id, userId: userId });
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

export const deleteComment = async (id, commentId, userId) => {
    return await Post.findByIdAndUpdate(
        id,
        {
            $pull: {
                comments: { _id: commentId, author: userId}
            }
        },
        { new: true }
    )
};
