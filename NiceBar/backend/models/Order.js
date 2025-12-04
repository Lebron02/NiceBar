import mongoose from "mongoose"

const orderSchema = mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderItems: [ 
        {
            product: { 
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            name: { type: String, required: true }, 
            qty: { type: Number, required: true }, 
            price: { type: Number, required: true },
            image: { type: String, required: true }
        }
    ],
    shippingAddress: { 
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentIntentId: { type: String }, 
    paymentMethod: { type: String, required: true },
    paymentResult: { 
        id: { type: String },
        status: { type: String },
        email_address: { type: String },
    },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    deliveryStatus: {
        type: String,
        enum: ['Pending Packaging', 'Ready for Shipping', 'In Transit', 'Delivered'],
        default: 'Pending Packaging',
        required: true
    },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;