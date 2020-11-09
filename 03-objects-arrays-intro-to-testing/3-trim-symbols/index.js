/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (isNaN(size)) { return string };

  let result = '';

  for (let char of string) {
    if (result.slice(-size) !=  char.repeat(size)) {
      result += char;
    }
  }
  return result;
}
