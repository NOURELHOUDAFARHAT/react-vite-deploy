// tripRoutes.js
const express = require("express");
const router = express.Router();
const CommentModel = require("../models/comment");

router.post("/", (req, res) => {
  const { msg, time, user,activity } = req.body;
  CommentModel.create({
    msg: msg,
    time: time,
    user: user,
    activity:activity,
  })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

module.exports = router;
