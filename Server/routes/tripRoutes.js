// tripRoutes.js
const express = require('express');
const router = express.Router();
const TripsModel = require('../models/trips');

router.post("/", (req, res) => {

    const { cover,title,country,state,countryFrom, description, startDate, endDate,  rangeDays,categories, plannerName, selectedUsers ,members} = req.body;
    TripsModel.create({ 
      cover:cover,
      title: title,
      description:description,
      countryFrom:countryFrom,
      country:country ,
      state:state,
      startDate: startDate,
    
      endDate: endDate,
   
      rangeDays: rangeDays,
      categories: categories,
      plannerName: plannerName,
      selectedUsers: selectedUsers,
      members: members,
    })
      .then((result) => res.json(result))
      .catch((err) => res.json(err));
  });

module.exports = router;
