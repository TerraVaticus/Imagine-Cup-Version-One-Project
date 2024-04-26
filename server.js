// server.js
const OpenAI = require('openai')
const express = require('express');
require('dotenv').config(); // Load environment variables from .env file
// const path = require('path');
const app = express();
const fs = require('fs'); 
const corsOptions = {
    origin: true,
    credentials: true,
  };
const cors = require('cors');
app.use(cors(corsOptions));
app.use(express.json());


const PORT = process.env.PORT || 5000;
/*
app.use('/', express.static(__dirname + '/build')); // Serves resources from client folder
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '/build', 'index.html'));
});
*/
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
