const express = require('express');
const router = express.Router();
const UserModel = require('../models/Users');

router.post('/',  async (req, res) => {

    const { fullName, email, password,avatar, } = req.body;

    UserModel.create({
      fullName: fullName,
      email: email,
      password: password,
      avatar: avatar,
    })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});



module.exports = router;