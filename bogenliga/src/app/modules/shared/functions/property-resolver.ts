export function resolveNestedObjectProperties(theObject, path) {
  try {
    const separator = '.';

    return path.replace('[', separator).replace(']', '').split(separator).reduce(
      function getNestedProperty(obj, property) {
        return obj[property];
      }, theObject
    );

  } catch (err) {
    return undefined;
  }
}
