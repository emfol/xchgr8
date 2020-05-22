
exports.resolvePath = function resolvePath(object, path) {
  if (
    object !== null &&
    typeof object === 'object' &&
    typeof path === 'string'
  ) {
    const separator = path.indexOf('.');
    if (separator >= 0) {
      const component = path.slice(0, separator);
      return resolvePath(object[component], path.slice(separator + 1));
    }
    return object[path];
  }
};
