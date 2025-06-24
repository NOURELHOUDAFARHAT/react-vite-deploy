const express = require('express');
const router = express.Router();
const CommentModel = require('../models/comment');

router.get('/', (req, res) => {
  // Assuming you want to fetch the first user's ObjectID
  CommentModel .find()
  .then(Comment => res.json(Comment))
  .catch(err => res.json(err))
});


  
module.exports = router;