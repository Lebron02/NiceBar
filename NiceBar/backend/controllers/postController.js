import * as postService from "../services/postService.js";

export const getPosts = async (req, res) => {
    try {
        const posts = await postService.getAllPosts();
        res.json(posts);
    } catch (error) {
        res.status(500).json({message: "Błąd pobierania przy getPosts" });
    }
}

export const getPostById= async (req, res) => {
    try {
        const post = await postService.getPostBySlugOrId(req.params.id)
        if (!post) return res.status(404).json({ message: "Nie znaleziono posta" });
        res.json(post);
    } catch (error) {
        res.status(500).json({message: "Błąd pobierania przy getPostById" });
    }
}

export const addPost = async (req, res) => {
    const {title, description, images, products}  = req.body;
    const userId = req.user.userId
    
    try {
        const newPost = await postService.createPost({title, description, images, products}, userId);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({message: "Błąd dodawania przy addPost" });
    }
}

export const editPost = async (req, res) => {
    const {id} = req.params;
    const updateData = req.body;
    const userId = req.user.userId

    try {
        const post = await postService.updatePost(id, userId, updateData);
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
    const userId = req.user.userId
    try {
        const post = await postService.deletePost(id, userId);
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
        const post = await postService.addComment(id, userId, text);
        if(!post){
            return res.status(404).json({message: "Nie znaleziono posta"})
        } 
        res.json({ message: "Komentarz dodany" });
    } catch (error) {
        res.status(500).json({message: "Błąd usuwania przy addComment" });
    }
}

export const deleteComment = async (req, res) => {
    const {id, commentId} = req.params;
    try {
        const post = await Post.findByIdAndUpdate(id, commentId, userId);
        if(!post){
            res.status(404).json({message: "Błąd usuwania komentarza"})
        } 
        res.json({ message: "Komentarz usunięty" });
    } catch (error) {
        res.status(500).json({message: "Błąd usuwania przy deleteComment" });
    }
}