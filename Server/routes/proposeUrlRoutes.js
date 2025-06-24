const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

//const OPENGRAPH_API_KEY = '0d978159-a126-4896-bc46-e66a3750d45a';


router.get('/', (req, res) => {
    const { url } = req.query;
    if (!url) {
      return res.status(400).send('URL parameter is required');
    }
  
    fetch(`http://api.linkpreview.net/?key=31cac4a12adf7a7b5397be3cb8852cd1&q=${encodeURIComponent(url)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        console.error('Error fetching link preview data:', error);
        res.status(500).send('Error fetching link preview data');
      });
  });

module.exports = router;