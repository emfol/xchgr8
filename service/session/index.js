const axios = require('axios');
const utils = require('../utils');
const log = require('../log');
const config = require('../config.json');

/**
 * Constants
 */

const USER_AGENT = 'xchgr8/0.0.1';
const SHARED_INSTANCE = Symbol('SharedInstance');
const SERVICE_BASE_URL = 'services.openexchangerates.baseURL';
const SERVICE_OPTIONS = 'services.openexchangerates.options';

/**
 * Definitions
 */

const logger = log.getLogger('Session');

/**
 * Session Class
 */
class Session {
  /**
   * Initialize a new session object with a base URL
   * @param {string} baseURL The base URL for the new session object
   * @param {object} options Options for the internal axios instance
   */
  constructor(baseURL, options) {
    // Build Axios instance
    this.axios = axios.create({
      baseURL,
      timeout: 8192,
      headers: {
        'User-Agent': USER_AGENT,
      },
    });
    this.options = options;
  }

  /**
   * Perform request
   * @param {object} options options for the Axios request
   * @return {Promise} A promise that resolves to the Axios response object
   */
  request(options) {
    const settings = Object.assign({}, this.options, options);
    return Promise.resolve(this.axios.request(settings)).then((response) => {
      logger.info('Request Completed!');
      return response;
    }, (error) => {
      logger.warn('Request Failed:', error);
      return null;
    });
  }

  /**
   * Retrieve a reference to the shared instance of the Session object
   * @return {Session} A reference to the shared/global Session object
   */
  static getSharedInstance() {
    let session = Session[SHARED_INSTANCE];
    if (!(session instanceof Session)) {
      session = new Session(
          utils.resolvePath(config, SERVICE_BASE_URL),
          utils.resolvePath(config, SERVICE_OPTIONS),
      );
      Session[SHARED_INSTANCE] = session;
      logger.info('Shared session instance initialized.');
    }
    return session;
  }
}

exports.Session = Session;
