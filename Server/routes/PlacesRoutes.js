const express = require("express");
const PlacesModel = require("../models/places");
const router = express.Router();

router.post("/", (req, res) => {
  const { image, title, description, numDay, tripId, staysId } = req.body;

  const newPlaces = new PlacesModel({
    image,
    title,
    description,
    numDay,
    tripId,
    staysId,
  });

  newPlaces
    .save()
    .then(() => {
      res.status(201).json({ message: "Place added successfully" });
    })
    .catch((err) => {
      console.error("Error adding Places:", err);
      res.status(500).json({ error: "Failed to add Place" });
    });
});

module.exports = router;
