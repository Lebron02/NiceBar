import mongoose from "mongoose"

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, 
    description: { type: String, required: true },
    price: { type: Number, required: true, min: [0, 'Cena nie może być ujemna'] },
    countInStock: { type: Number, required: true, default: 0, min: [0, 'Ilość nie może być ujemna'] }, 
    images: [{ type: String }],
    brand: { type: String, required: true },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Category", 
        required: true 
    },
    relatedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }]
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;