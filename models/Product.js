import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String }, // URL to product image
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema );