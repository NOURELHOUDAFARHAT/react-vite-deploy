const express = require('express');
const router = express.Router();
const TripModel = require('../models/trips');

router.get('/:tripId', (req, res) => {
    // Assuming you want to fetch the first user's ObjectID
    const { tripId } = req.params;
    TripModel.findById(tripId)
    
      .select('categories rangeDays') // Select both categories and rangeDays
      .then(trip => {
        if (!trip) {
          return res.status(404).json({ message: 'No rangedays found' });
        }
        // Return the rangeDays and categories
        res.status(200).json({ rangeDays: trip.rangeDays, categories: trip.categories });
      })
      .catch(error => {
        console.error('Error fetching rang days:', error);
        res.status(500).json({ message: 'Server error' });
      });
  });


module.exports = router;
