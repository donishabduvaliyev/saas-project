import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['restaurant', 'clothing', 'beauty', 'other'], default: 'other' },
    description: { type: String },
    logo: { type: String }, 
    telegramBotToken: { type: String }, 
    telegramChatId: { type: String },

    // Domain & link
    domain: { type: String },
    slug: { type: String, unique: true },

    // Contact & location
    contactPhone: { type: String },
    address: { type: String },
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },

    // Schedule
    schedule: [{
        day: { type: String, enum: ['mon','tue','wed','thu','fri','sat','sun'] },
        open: { type: String },
        close: { type: String },
        isClosed: { type: Boolean, default: false }
    }],

    // Bot & shop settings
    botSettings: {
        welcomeMessage: { type: String, default: "Welcome to our shop!" },
        language: { type: String, default: "en" },
        currency: { type: String, default: "USD" },
    },

    // Plan & stats
    plan: { type: String, enum: ['free','basic','premium'], default: 'free' },
    stats: {
        totalOrders: { type: Number, default: 0 },
        totalRevenue: { type: Number, default: 0 },
        totalUsers: { type: Number, default: 0 },
    },

    // Future integrations
    integrations: {
        paymentProviders: [{ type: String }],
        deliveryProviders: [{ type: String }],
    },

    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
});

export default mongoose.model('Shop-Post-Production', shopSchema);
