/**
 * Imports
 */

const express = require('express');
const cors = require('cors');
const api = require('./api');
const log = require('./log');

/**
 * Constants
 */

const PORT = 8001;

/**
 * Initialization
 */

const app = express();
const logger = log.getLogger('xchgr8');

/**
 * Endpoints
 */

app.options('*', cors());
app.get('/ping', (req, res) => res.json({message: 'pong'}));
app.get('/api/convert/:value/:from/:to', api.convert);
app.get('/api/currencies', api.currencies);

const port = process.env.PORT || PORT;
app
    .listen(port, () => {
      logger.info('Server running at:', port);
    })
    .on('error', (error) => {
      if (error) {
        logger.error('Failed to start server...', error.code);
      }
    });
