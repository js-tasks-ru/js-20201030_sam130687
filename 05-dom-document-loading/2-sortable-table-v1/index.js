export default class SortableTable {

  constructor(header = '',
              {data=[]} = {}) {
    this.header = header;
    this.data = data;
    this.createNode();
  };
  // Создание вставляемого узла.
  createNode() {
    let el = document.createElement('div');
    el.innerHTML = this.template;
    this.element = el.firstElementChild;
    this.subElements = this.getBodyElements(this.element);
  };
  //соберем все дочерние узлы в массив
  getBodyElements(element) {
   /*
   * тут интересная фичка выходит
   * let arr = element.querySelectorAll('[data-element]') - соберет псевдо массив по <div data-element=".....
   * Потом мы можем по dataset вытащить все
   * например <div class="sortable-table__cell" data-id="images" data-sortable="false" data-order="asc">
   * arr[0].dataset.sortable т.е. тащится все то что начинается с data-
   * Таки образом мы можем выдрать hhead, body, foot etc
   * */
    const elementAggregator = {};
    Array.from(element.querySelectorAll('[data-element]')).forEach(item => {
      elementAggregator[item.dataset.element] = item;
    });
    return elementAggregator;
  };
  // Генератор заголовков
  getHeaders(headerArray) {
    //id: 'title', title: 'Name', sortable: true, sortType: 'string'
    // Учитывается что если сейчас есть сортируемый столбец то рисуем сортировочный крыжик.
    return headerArray.map(item => {
      if ((this.ordHeader) && (item.id === this.ordHeader.orderHeader.id)) {
        return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${this.ordHeader.orderValue}">
          <span>${item.title}</span>
          <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
          </span>
        </div>`
      } else {
        return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
                <span>${item.title}</span>
            </div>`;
      }
    }).join('');
  };
  // генератор столбоцов строки
  getRowColumns(dataItem) {
    return this.header.map(item => {
      // Если картинка то вернем то что в 1 колонке под методом получения template image

      if (item.template) {
        return item.template(dataItem[item.id]);
      } else { // иначе вернем ячейку в строке под столбцом брр...
        return `<div class="sortable-table__cell">${dataItem[item.id]}</div>`;
      }
    }).join('');
  };
  // генератор строк
  getRows(dataArray) {
    return dataArray.map(item => {
      return `<a href="/products/${item.id}" class="sortable-table__row">
        ${this.getRowColumns(item)}
    </a>`;
    }).join('');
  };

  get template() {
    return `<div data-element="productsContainer" class="products-list__container">
  <div class="sortable-table">
    <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.getHeaders(this.header)}
    </div>
    <div data-element="body" class="sortable-table__body">
        ${this.getRows(this.data)}
    </div>
    <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
    <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
      <div>
        <p>No products satisfies your filter criteria</p>
        <button type="button" class="button-primary-outline">Reset all filters</button>
      </div>
    </div>
  </div>
</div>`
  };

  getOrderDirect(orderValue){
    switch (orderValue) {
      case 'asc':
        return 1;
        break;
      case 'desc':
        return -1;
        break;
      default:
        throw new Error(`Error in parametr "orderValue = ${orderValue}"!`);
    }
  };

 /* Сортировка сложных объектов
 let sortedRows = Array.from(table.rows)
    .slice(1)
    .sort((rowA, rowB) => rowA.cells[0].innerHTML > rowB.cells[0].innerHTML ? 1 : -1);

  table.tBodies[0].append(...sortedRows);*/


  sort(fieldValue, orderValue){
    //Объект и тип сортировки для отрисовки
    this.ordHeader = {};
    //Хидер колонки по которой будем сортироваться orderHeader
    const orderHeader = this.header.find(item => {
        return item.id === fieldValue
      });

    if (orderHeader.sortable) {
      //Направление сортировки ordDir
      const ordDir = this.getOrderDirect(orderValue);
      this.ordHeader = {orderHeader, orderValue};
      //Сортировка строк
      this.data = this.data.sort(function (rowA, rowB) {
        // На каждый тип данных свой сортировщик
        switch (orderHeader.sortType) {
          case 'string':
            const strA = rowA[orderHeader.id];
            const strB = rowB[orderHeader.id];
            return ordDir * strA.localeCompare(strB, ['ru', 'en'], {caseFirst: 'upper'});
            break;
          case 'number':
            const numA = rowA[orderHeader.id];
            const numB = rowB[orderHeader.id];
            return ordDir * (numA - numB);
            break;
          case 'date':
            const dA = rowA[orderHeader.id];
            const dB = rowB[orderHeader.id];
            return ordDir * (dA - dB);
            break;
          default:
            throw new Error(`Error type of sorting = ${orderHeader.sortType}"!`);
        }
      });
      // Перерисовка заголовка таблицы для отображения сортируемого столбца и направления сортировки.
      this.subElements.header.innerHTML = this.getHeaders(this.header);
      // Перерисовка данных таблицы в сортированном виде
      this.subElements.body.innerHTML = this.getRows(this.data);
    }
  };

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
