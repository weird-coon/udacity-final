const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');
const getTripInfo = require('./api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());

/* Middleware*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initialize the main project folder
app.use(express.static('dist'));
app.get('/', (req, res) => {
  res.sendFile(path.resolve('dist/index.html'));
});

// 3rd API handle
app.post('/trip-planner', async (req, res) => {
  try {
    const location = encodeURI(req.body.location);
    const data = await getTripInfo(location);
    // Send data to client
    res.send(data);
  } catch (err) {
    console.error(err);
  }
});

// Setting up Node server
app.listen(PORT, () => {
  console.log(
    `\x1b[33mNow app is running on:\x1b[32m http://localhost:${PORT}`,
  );
});
