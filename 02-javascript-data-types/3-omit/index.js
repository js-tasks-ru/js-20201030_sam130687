/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  let _obj = {};
  for (let key in obj) {
    if (!fields.includes(key)) {
      _obj[key] = obj[key];
    }
  }
  return _obj;
};
