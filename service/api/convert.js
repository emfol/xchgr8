const log = require('../log');
const exchange = require('./exchange');

/**
 * Constants
 */


/**
 * Definitions
 */

const logger = log.getLogger('convert');

/**
 * Convert API
 */

exports.convert = async function convert(req, res) {
  const {value: stringValue, from, to} = req.params;
  const value = parseFloat(stringValue);
  const rates = await exchange.rates();
  if (!rates) {
    logger.warn('Failed to retrieve exchange rate data...');
    return res.status(503).json({
      error: 'Service Unavailable',
    });
  }
  if (
    !rates.hasOwnProperty(from) ||
    !rates.hasOwnProperty(to) ||
    isNaN(value)
  ) {
    logger.info('Requested currency not found', from, to);
    return res.status(400).json({
      error: 'Bad Request',
    });
  }
  if (rates[from] <= 0) {
    logger.warn('Invalid rate value', rates[from]);
    return res.status(500).json({
      error: 'Internal Server Error',
    });
  }
  const rate = rates[to] / rates[from];
  const conversion = value * rate;
  return res.status(200).json({
    from,
    to,
    value,
    conversion,
    rate,
  });
};
