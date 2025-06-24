const express = require('express');
const router = express.Router();
const UsersModel = require('../models/Users');

router.get('/', (req, res) => {
  // Assuming you want to fetch the first user's ObjectID
  UsersModel.find()
  .then(users => res.json(users))
  .catch(err => res.json(err))
});
  
module.exports = router;