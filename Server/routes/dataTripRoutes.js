const express = require('express');
const router = express.Router();
const TripsModel = require('../models/trips');

router.get('/', (req, res) => {
  // Assuming you want to fetch the first user's ObjectID
  TripsModel.find()
  .then(trips => res.json(trips))
  .catch(err => res.json(err))
});


  
module.exports = router;