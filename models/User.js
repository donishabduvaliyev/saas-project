import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "shopowner", "customer"],
      default: "customer",
    },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" }, 
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema, "user-data-saas");
