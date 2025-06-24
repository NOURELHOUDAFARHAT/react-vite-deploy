const express = require('express');
const router = express.Router();

const PlacesModel = require('../models/places');

router.get('/:tripId', (req, res) => {
  const { tripId } = req.params;

  PlacesModel.find({ tripId })
    .select('_id title description image numDay tripId userId')
    .then(places => {
      if (!places || places.length === 0) {
        return res.status(404).json({ message: 'No places found' });
      }
      // Assuming you want to return the first place's ID
      const placeIds = places.map(place => place._id);
      res.json({ placeIds, places });
    })
    .catch(error => {
      console.error('Error fetching places:', error);
      res.status(500).json({ message: 'Server error' });
    });
});

module.exports = router;
