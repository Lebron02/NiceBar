import mongoose from "mongoose"

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comments: [{
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: {
            type: String,
            required: true,
        }, 
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;

