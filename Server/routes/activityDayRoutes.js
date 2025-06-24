const express = require('express');
const router = express.Router();

const ActivityModel = require('../models/activities');

router.get('/:tripId', (req, res) => {
    // Assuming you want to fetch the first user's ObjectID
    const { tripId } = req.params;
    ActivityModel.findById(tripId)
    
      .select('numDay') // Select both categories and rangeDays
      .then(activity=> {
        if (!activity) {
          return res.status(404).json({ message: 'No rangedays found' });
        }
        // Return the rangeDays and categories
        res.status(200).json({ numDay: activity.numDay });
      })
      .catch(error => {
        console.error('Error fetching rang days:', error);
        res.status(500).json({ message: 'Server error' });
      });
  });


module.exports = router;
