const {deferred} = require('./deferred.js');
const {resolvePath} = require('./resolvePath.js');

/**
 * Utils
 */

// eslint-disable-next-line require-jsdoc
function timeout(delay) {
  const d = deferred();
  setTimeout(function() {
    d.resolve(Date.now());
  }, delay);
  return d.promise;
}

/**
 * Exports
 */

exports.deferred = deferred;
exports.resolvePath = resolvePath;
exports.timeout = timeout;
