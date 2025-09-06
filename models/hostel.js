import { Schema, model, models } from "mongoose";

const HostelSchema = new Schema(
  {
    name: { type: String, required: true },

    images: [{ type: String }],

    address: {
      country: { type: String, required: true },
      state: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    price: { type: Number, required: true },

    description: { type: String },

    // Which user (provider) owns this hostel
    provider: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default models.Hostel || model("Hostel", HostelSchema);
