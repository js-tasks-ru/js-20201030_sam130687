/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  let res = arr.slice();
  return res.sort(function (a, b) {
    return ((param == 'asc') ? 1 : -1) * a.localeCompare(b, ['ru', 'en'], { caseFirst: 'upper' });
  });
};
