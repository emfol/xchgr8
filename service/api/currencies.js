const log = require('../log');
const exchange = require('./exchange');

/**
 * Constants
 */


/**
 * Definitions
 */

const logger = log.getLogger('currencies');

/**
 * Currencies API
 */

exports.currencies = async function currencies(req, res) {
  const rates = await exchange.rates();
  if (!rates) {
    logger.warn('Failed to retrieve exchange rate data...');
    return res.status(503).json({
      error: 'Service Unavailable',
    });
  }
  return res.status(200).json({
    symbols: Object.keys(rates),
  });
};
