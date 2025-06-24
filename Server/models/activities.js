const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    image: String,
    category: String,
    from: String,
    to: String,
    day: Number,
    numDay: Number,
    type: String,
    suggestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    price: Number,
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: "trips" },
    userId:[{ type: mongoose.Schema.Types.ObjectId, ref: "users"  }],
    placeId:{ type: mongoose.Schema.Types.ObjectId, ref: "places" },
  },
  { collection: "activities" }
);
const ActivityModel = mongoose.model("activities", ActivitySchema);


module.exports = ActivityModel;
