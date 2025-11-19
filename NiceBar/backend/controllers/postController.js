import Post from "../models/Post.js";

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({});
        res.json(posts);
    } catch (error) {
        res.status(500).json({message: "Błąd pobierania przy getPosts" });
    }
}

export const getPostById= async (req, res) => {
    const {id} = req.params;
    try {
        const post = await Post.findById(id).populate("comments.author", "firstName lastName");
        res.json(post);
    } catch (error) {
        res.status(500).json({message: "Błąd pobierania przy getPostById" });
    }
}

export const addPost = async (req, res) => {
    const {title, description} = req.body;
    
    try {
        const post = new Post({ title, description, userId: req.user.userId});
        await post.save();

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({message: "Błąd dodawania przy addPost" });
    }
}

export const editPost = async (req, res) => {
    const {id} = req.params;
    const {title, description} = req.body;
    try {
        const post = await Post.findOneAndUpdate(
            { _id: id, userId: req.user.userId },
            { title, description},
            { new: true }
        );
        if(!post){
            return res.status(404).json({message: "Błąd modyfikacji posta"})
        } 
        res.json(post);
    } catch (error) {
        console.error("Szczegóły błędu editPost:", error);
        res.status(500).json({message: "Błąd modyfikacji przy editPost" });
    }
}

export const deletePost = async (req, res) => {
    const {id} = req.params;
    try {
        const post = await Post.findOneAndDelete(
            { _id: id, userId: req.user.userId },
        );
        if(!post){
            res.status(404).json({message: "Błąd usuwania posta"})
        } 
        res.json({ message: "Zadanie usunięte" });
    } catch (error) {
        res.status(500).json({message: "Błąd usuwania przy deletePost" });
    }
}

export const addComment= async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;

    try {
        const post = await Post.findByIdAndUpdate(
            id, { $push : { comments: { author: userId, text: text}}}, {new: true}
        );
        if(!post){
            res.status(404).json({message: "Nie znaleziono posta"})
        } 
        res.json({ message: "Komentarz dodany" });
    } catch (error) {
        res.status(500).json({message: "Błąd usuwania przy addComment" });
    }
}

export const deleteComment = async (req, res) => {
    const {id, commentId} = req.params;
    try {
        const post = await Post.findByIdAndUpdate(
           id, { $pull : { comments: { _id: commentId, author: req.user.userId}}}, {new: true}
        );
        if(!post){
            res.status(404).json({message: "Błąd usuwania komentarza"})
        } 
        res.json({ message: "Komentarz usunięty" });
    } catch (error) {
        res.status(500).json({message: "Błąd usuwania przy deleteComment" });
    }
}