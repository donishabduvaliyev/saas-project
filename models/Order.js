import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },  
        price: { type: Number, required: true }, 
        quantity: { type: Number, required: true, min: 1 }
    }],

    total: { type: Number, required: true, min: 0 },

    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
        default: 'pending' 
    },


    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, required: true },
    customerTelegramId: { type: String },

  
    paymentStatus: { 
        type: String, 
        enum: ['unpaid', 'paid'], 
        default: 'unpaid' 
    },
    deliveryMethod: { 
        type: String, 
        enum: ['pickup', 'delivery'], 
        default: 'delivery' 
    },
    deliveryFee: { type: Number, default: 0 },

    notes: { type: String },
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true });

orderSchema.index({ shopId: 1, status: 1, createdAt: -1  ,customer: 1,});

export default mongoose.model('Order', orderSchema);
