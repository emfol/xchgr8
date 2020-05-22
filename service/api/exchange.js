/* eslint-disable require-jsdoc */
const log = require('../log');
const cache = require('../cache');
const {Session} = require('../session');

/**
 * Constants
 */

const CACHE_KEY = 'exchangeRates';

/**
 * Definitions
 */

const logger = log.getLogger('exchange');

/**
 * Exchange
 */

exports.rates = async function rates() {
  let data = await readCachedData();
  if (!data) {
    data = await fetchAndCacheData();
    if (!data) {
      return null;
    }
  }
  return data.rates;
};

/**
 * Utils
 */

async function readCachedData() {
  const rawData = await cache.read(CACHE_KEY);
  if (rawData) {
    try {
      const data = JSON.parse(rawData);
      if (isValidData(data)) {
        logger.info('Data retrieved from cache!');
        return data;
      } else {
        logger.warn('Cached data is not valid...');
      }
    } catch (e) {
      logger.warn('Error parsing cached data...');
    }
  }
  return null;
}

async function fetchAndCacheData() {
  const response = await Session.getSharedInstance().request({
    method: 'GET',
    url: '/latest.json',
  });
  if (
    response !== null &&
    typeof response === 'object' &&
    response.status === 200 &&
    isValidData(response.data)
  ) {
    const json = JSON.stringify(response.data);
    if (await cache.write(CACHE_KEY, json)) {
      logger.info('Data saved to cache!');
    } else {
      logger.warn('Failed to save retrieved data to cache...');
    }
    return response.data;
  } else {
    logger.warn('Response data did not pass validation');
  }
  return null;
}

function isValidData(subject) {
  return (
    subject !== null &&
    typeof subject === 'object' &&
    subject.base === 'USD' &&
    Object.prototype.toString.call(subject.rates) === '[object Object]'
  );
}
