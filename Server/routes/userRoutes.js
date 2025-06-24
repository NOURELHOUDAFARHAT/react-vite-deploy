const express = require('express');
const router = express.Router();
const UserModel = require('../models/Users');

router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  UserModel.findById(userId)
    .select('fullName avatar')
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'No user found' });
      }
      res.status(200).json({
        fullname: user.fullName,
        avatar: user.avatar
      });
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Server error' });
    });
});

module.exports = router;
