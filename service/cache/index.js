/* eslint-disable require-jsdoc */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const utils = require('../utils');
const log = require('../log');
const config = require('../config.json');

/**
 * Constants
 */

const ENCODING = 'utf8';
const DIR = utils.resolvePath(config, 'cache.dir').split('/').join(path.sep);
const TTL = utils.resolvePath(config, 'cache.ttl') || 300 * 1000; // 5min

/**
 * Definitions
 */

const logger = log.getLogger('Cache');
const options = {
  dir: DIR,
  ttl: TTL,
};

/**
 * Read data from storage if available
 * @param {string} key The key to retrieve stored data
 * @return {Promise} A promise that resolves to the data stored data
 */
async function read(key) {
  const {path} = getKeyInfo(key);
  let data = null;
  try {
    const stats = await stat(path);
    if (Date.now() - stats.mtimeMs > options.ttl) {
      await unlink(path);
    } else {
      data = await readFile(path);
    }
  } catch (e) {
    if (e.code !== 'ENOENT') {
      logger.error('Read error:', e.message);
    }
  }
  return data;
}

/**
 * Write data to storage
 * @param {string} key The key to store the data
 * @param {string} data The data to be stored
 */
async function write(key, data) {
  const {dir, path} = getKeyInfo(key);
  let result = false;
  try {
    await mkdir(dir);
    result = await writeFile(path, data);
  } catch (e) {
    logger.error('Write error:', e.message);
  }
  return result;
}

/**
 * Read internal options
 * @param {string} name The name of the field
 * @return {any} The value of the option or undefined
 */
function getOption(name) {
  if (options.hasOwnProperty(name)) {
    return options[name];
  }
}

/**
 * Set internal options
 * @param {string} name The name of the field
 * @param {any} value The value of the field
 */
function setOption(name, value) {
  if (options.hasOwnProperty(name)) {
    options[name] = value;
  }
}

/**
 * Utils
 */

function getKeyInfo(key) {
  const hash = getHash(key);
  const dir = [options.dir, hash.slice(0, 2)].join(path.sep);
  return Object.freeze({
    key,
    hash,
    dir,
    path: `${dir}${path.sep}${hash.slice(2)}`,
  });
}

function stat(path) {
  const deferred = utils.deferred();
  fs.stat(path, function(error, stat) {
    if (error) {
      deferred.reject(error);
      return;
    }
    deferred.resolve(stat);
  });
  return deferred.promise;
}

function readFile(path) {
  const deferred = utils.deferred();
  fs.readFile(path, ENCODING, function(error, data) {
    if (error) {
      deferred.reject(error);
      return;
    }
    deferred.resolve(data);
  });
  return deferred.promise;
}

function mkdir(path) {
  const deferred = utils.deferred();
  const options = {recursive: true};
  fs.mkdir(path, options, function(error) {
    if (error) {
      deferred.reject(error);
      return;
    }
    deferred.resolve(true);
  });
  return deferred.promise;
}

function writeFile(path, data) {
  const deferred = utils.deferred();
  fs.writeFile(path, data, ENCODING, function(error) {
    if (error) {
      deferred.reject(error);
      return;
    }
    deferred.resolve(true);
  });
  return deferred.promise;
}

function unlink(path) {
  const deferred = utils.deferred();
  fs.unlink(path, function(error) {
    if (error) {
      deferred.reject(error);
      return;
    }
    deferred.resolve(true);
  });
  return deferred.promise;
}

function getHash(string) {
  return crypto.createHash('sha1').update(string).digest('hex');
}

/**
 * Exports
 */

exports.setOption = setOption;
exports.getOption = getOption;
exports.read = read;
exports.write = write;
