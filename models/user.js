import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true, // Firebase UID should be unique
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["normaluser", "hostelprovider"],
      default: "normaluser",
    },
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
