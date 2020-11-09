/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  // Массив путей свойств объекта
  const arrPath = path.split(".");
  // Рекурсивная функция вычисления свойства объекта при многократном вхождении объекта в объект.
  // Где obj это объект который получается по мере входа в объект, index это уровень вложенного свойства
  function getProp(obj, index) {
    if (typeof( obj[arrPath[index]]) === "object") {
      return getProp(obj[arrPath[index]], ++index)
    } else {
      return obj[arrPath[index]];
    };
  }
  // возращаемая функция которая вернет любое свойство из объекта
  return function(obj) {
    if (obj != undefined) {
      return getProp(obj, 0);
    }
  }
}
