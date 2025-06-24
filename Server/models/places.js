const mongoose = require("mongoose");

// Define the user schema
const PlacesSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    image: String,
    numDay: Number,
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: "trips" },
    userId: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],

  },
  { collection: "places" }
);

// Create the User model based on the user schema
const PlacesModel = mongoose.model("places", PlacesSchema);

module.exports = PlacesModel;
