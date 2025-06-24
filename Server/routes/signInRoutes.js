const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/Users');

router.post('/', (req, res) => {
    const { email, password } = req.body;
  
    UserModel.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }
   
        bcrypt.compare(password, user.password)
                .then((isPasswordValid) => {
                    if (!isPasswordValid) {
                        return res.status(401).json({ message: 'Invalid password' });
                    }
  
            // User is authenticated, generate JWT token
            const token = jwt.sign({ userId: user._id }, 'your_secret_key');
  
           // Return user ID and token in the response
            res.status(200).json({ userId: user._id, token });
          })
          .catch((err) => {
            console.error('Error comparing passwords:', err);
            res.status(500).json({ message: 'Server error' });
          });
      })
      .catch((err) => {
        console.error('Error finding user:', err);
        res.status(500).json({ message: 'Server error' });
      });
  });

module.exports = router;