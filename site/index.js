/**
 * Imports
 */

const express = require('express');
const path = require('path');

/**
 * Constants
 */

const PORT = 8000;
const PUBLIC_DIR = 'public';

/**
 * Initialization
 */

const app = express();

/**
 * Middlewares
 */

app.use(express.static(path.join(__dirname, PUBLIC_DIR)));

/**
 * Endpoints
 */

app.get('/ping', (req, res) => res.json({message: 'pong'}));

const port = process.env.PORT || PORT;
app
    .listen(port, () => {
      console.info('Server running at:', port);
    })
    .on('error', (error) => {
      if (error) {
        console.error('Failed to start server...', error.code);
      }
    });
