// @TODO: node-fetch from v3 is an ESM-only, move v2 -> v3
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');
require('dotenv').config();

// const API_KEY = process.env.API_KEY || '11ef8129a7e40d5168f27585c71adad5';
const app = express();
const PORT = 8000;
app.use(cors());

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initialize the main project folder
app.use(express.static('dist'));
app.get('/', (req, res) => {
  res.sendFile(path.resolve('dist/index.html'));
});

// Setting up Node server
app.listen(process.env.PORT || PORT, () => {
  console.log(`Now app is running on http://localhost:${PORT}`);
});
