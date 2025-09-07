import { Schema, model, models } from "mongoose";

const FavoritesSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for faster queries on user
    },
    hostels: [
      {
        type: Schema.Types.ObjectId,
        ref: "Hostel",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    // Ensure unique combination of user and hostel to prevent duplicate favorites
    indexes: [{ key: { user: 1, hostels: 1 }, unique: true }],
  }
);

export default models.Favorites || model("Favorites", FavoritesSchema);
