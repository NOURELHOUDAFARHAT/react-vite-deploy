const express = require("express");
const router = express.Router();
const ActivityModel = require("../models/activities");

router.post("/", (req, res) => {
  const {
    title,
    description,
    image,
    category,
    suggestedBy,
    from,
    to,
    day,
    numDay,
    type,
    tripId,
    userId,
    placeId,
    price,
  } = req.body;

  const newActivity = new ActivityModel({
    title,
    description,
    image,
    category,
    from,
    to,
    day,
    numDay,
    suggestedBy,
    type,
    tripId,
    userId,
    placeId,
    price,
  });

  newActivity
    .save()
    .then(() => {
      res.status(201).json({ message: "Activity added successfully" });
    })
    .catch((err) => {
      console.error("Error adding Activity:", err);
      res.status(500).json({ error: "Failed to add Activity" });
    });
});

module.exports = router;
