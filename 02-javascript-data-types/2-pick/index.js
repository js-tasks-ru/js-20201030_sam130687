/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  let _obj = {};
  for (let arg in fields) {
    if (fields[arg] in obj) {
      _obj[fields[arg]] = fields[arg];
    }
  };
  return _obj;
};
