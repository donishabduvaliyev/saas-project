import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['restaurant', 'clothing', 'beauty', 'other'], default: 'other' },
    description: { type: String },
    logo: { type: String }, 
    slug: { type: String, unique: true, required: true },
    template: { type: String, enum: ['template-cosmetics', 'template-flower', 'template-outfit', 'template-outfit2', 'template-watch'], default: 'template-cosmetics' },
    telegramBotToken: { type: String }, 
    telegramChatId: { type: String }, 
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
});

export default mongoose.model('Shop', shopSchema, 'shop-data-saas');