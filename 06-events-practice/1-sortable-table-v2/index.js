export default class SortableTable {


  constructor(header = [],
              {data=[]} = {}) {
    this.header = header;
    this.data = data;
    this.headerClick = this.headerClick.bind(this);
    this.findDefaultSortColumn();
    this.sort();
    this.render();
    this.addListener();
  };

  findDefaultSortColumn(){
    this.defaultSortColumn = this.header.find(item => {
      return item.sortable === true
    }).id;
  };
  // Создание вставляемого узла.
  render() {
    const el = document.createElement('div');
    el.innerHTML = this.template;
    this.element = el.firstElementChild;
    this.subElements = this.getBodyElements(this.element);
    this.subElements.header.innerHTML = this.getHeaders(this.header);
    this.subElements.body.innerHTML = this.getRows(this.data);
  };
  // Назначение события обработки клика колонки
  addListener(){
    this.subElements.header.addEventListener( "pointerdown" , this.headerClick);
  };

  headerClick(event){
    const headercell = event.target.closest('[data-id]'); //dic

    if (!headercell) return;

    const sortColumn = headercell.getAttribute('data-id');

    const ordVal =  (headercell.getAttribute('data-order') == 'desc') ? 'asc' : 'desc';

    this.sort(sortColumn, ordVal);

    this.subElements.header.innerHTML = this.getHeaders(this.header);
    this.subElements.body.innerHTML = this.getRows(this.data);
  };

  //соберем все дочерние узлы в массив
  getBodyElements(element) {
    const elementAggregator = {};
    Array.from(element.querySelectorAll('[data-element]')).forEach(item => {
      elementAggregator[item.dataset.element] = item;
    });
    return elementAggregator;
  };

  // Генератор заголовков
  getHeaders(headerArray) {
    // Учитывается что если сейчас есть сортируемый столбец то рисуем сортировочный крыжик.
    return headerArray.map(item => {
      return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${(item.id === this.ordHeader['id']) ? this.ordHeader['order'] : ''}">
          <span>${item.title}</span>
          <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
          </span>
        </div>`
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
// ${this.getHeaders(this.header)} ${this.getRows(this.data)}
  get template() {
    return `<div data-element="productsContainer" class="products-list__container">
  <div class="sortable-table">
    <div data-element="header" class="sortable-table__header sortable-table__row"></div>
    <div data-element="body" class="sortable-table__body"></div>
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

  sort(fieldValue = this.defaultSortColumn, orderValue = 'asc'){
    //Хидер колонки по которой будем сортироваться orderHeader
    const orderHeader = this.header.find(item => {
      return item.id === fieldValue
    });
    this.ordHeader = {};

    if (orderHeader.sortable) {
      //Направление сортировки ordDir
      const ordDir = orderValue === 'asc' ? 1 : -1;
      this.ordHeader['id'] = orderHeader.id;
      this.ordHeader['order'] = orderValue;
      //Сортировка строк
      this.data = this.data.sort(function (rowA, rowB) {
        // На каждый тип данных свой сортировщик
        const a = rowA[orderHeader.id];
        const b = rowB[orderHeader.id];
        switch (orderHeader.sortType) {
          case 'string':
            return ordDir * a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
            break;
          case 'number':
            return ordDir * (a - b);
            break;
          case 'date':
            return ordDir * (a - b);
            break;
          default:
            throw new Error(`Error type of sorting = ${orderHeader.sortType}"!`);
        }
      });
    }
  };

  remove () {
    this.subElements.header.removeEventListener( "pointerdown" , this.headerClick);
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
