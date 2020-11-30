export default class RangePicker {
  element = null;
  subElements = {};
  isSelect = true;
  selected = {
    from: new Date(),
    to: new Date()
  };

  constructor({
                from = new Date(),
                to = new Date()
              } = {})
    {
      this.leftDateFrom = new Date(from);
      this.selected = {from, to};

      this.render();
    };

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getBodyElements(element);

    this.addEventListeners();
  };

  formatDate(date) { // Получить дату по нашенски 01.01.2020, хотя в темлейте по ихнему, но тест хочет по нашему
    return date.toLocaleString('ru', {dateStyle: 'short'});
  }

  get template() { //Верхнеуровневый шаблон узлов.
    return `<div class="rangepicker">
      <div class="rangepicker__input" data-element="input">
        <span data-element="from">${this.formatDate(this.selected.from)}</span> -
        <span data-element="to">${this.formatDate(this.selected.to)}</span>
      </div>
      <div class="rangepicker__selector" data-element="selector"></div>
    </div>`;
  };

  getBodyElements(element) {
    const elementAggregator = {};
    Array.from(element.querySelectorAll('[data-element]')).forEach(item => {
      elementAggregator[item.dataset.element] = item;
    });
    return elementAggregator;
  };

  addEventListeners() {
    const {input, selector} = this.subElements;

    document.addEventListener('click', this.onClickDoc, true);
    input.addEventListener('click', this.onRangeClick);
    selector.addEventListener('click', this.onDatesClick);
  };
  // клики верхнего уровня нужно всплытие чтобы после выбора интервала закрыть все.
  onClickDoc = event => {
    // Проверим что мы это мы в цели
    const isIAm = this.element.contains(event.target);
    // А собсно открыты ли мы?
    const isIOPen = this.element.classList.contains('rangepicker_open');
    // Я существую? значит должен умереть
    if (isIOPen && !isIAm) {
      this.close();
    }
  };
  // клики месячных ушей.
  onRangeClick = event => {
    this.element.classList.toggle('rangepicker_open');
    this.renderSelector();
  };
  // клики дней
  onDatesClick = event => {
    if (event.target.classList.contains('rangepicker__cell')) {
      this.onDayClick(event.target);
    }
  };

  renderSelector() {
    const leftDate = new Date(this.leftDateFrom);
    const rightDate = new Date(leftDate);
    const { selector } = this.subElements;
    rightDate.setMonth(rightDate.getMonth() + 1);

    selector.innerHTML = `
      <div class="rangepicker__selector-arrow"></div>
      <div class="rangepicker__selector-control-left"></div>
      <div class="rangepicker__selector-control-right"></div>
      ${this.renderCalendar(leftDate)}
      ${this.renderCalendar(rightDate)}
    `;

    const controlLeft = selector.querySelector('.rangepicker__selector-control-left');
    const controlRight = selector.querySelector('.rangepicker__selector-control-right');
    // События кликов на ухи месяцев
    controlLeft.addEventListener('click', this.goToPrevMonth);
    controlRight.addEventListener('click', this.goToNextMonth);
    // покрасочка
    this.renderHighlight();
  };

  renderCalendar(showDate) {
    const date = new Date(showDate);
    const getDayIndInRusCalenadar = inDateind => {
      if (inDateind === 0) {
        return 7;
      } else {
        return inDateind;
      }
    };

    // Генерация дней недели
    const monthName = date.toLocaleString('ru', {month: 'long'});
    const dayArr = [];
    dayArr.push(`<div class="rangepicker__calendar">
      <div class="rangepicker__month-indicator">
        <time datetime=${monthName}>${monthName}</time>
      </div>
      <div class="rangepicker__day-of-week">
        <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Вс</div>
      </div>
      <div class="rangepicker__date-grid">
    `);

    // Прописываем первый день
    date.setDate(1);
    dayArr.push(`
      <button type="button"
        class="rangepicker__cell" data-value="${date.toISOString()}"
        style="--start-from: ${getDayIndInRusCalenadar(date.getDay())}">${1}
      </button>`);
    // Прописываем последующие
    let i = 2;
    date.setDate(i);
    while (date.getMonth() === showDate.getMonth()) {
      dayArr.push(`
        <button type="button"
          class="rangepicker__cell"
          data-value="${date.toISOString()}">${i++}
        </button>`);
      date.setDate(i);
    }
    // Запихаем массив в таблицу
    dayArr.push('</div></div>');
    return dayArr.join('');
  };

  goToPrevMonth = event => {
    this.leftDateFrom.setMonth(this.leftDateFrom.getMonth() - 1);
    this.renderSelector();
  };

  goToNextMonth = event => {
    this.leftDateFrom.setMonth(this.leftDateFrom.getMonth() + 1);
    this.renderSelector();
  };

  close() {
    this.element.classList.remove('rangepicker_open');
  };

  renderHighlight() {
    const { from, to } = this.selected;

    for (const cell of this.element.querySelectorAll('.rangepicker__cell')) {
      const { value } = cell.dataset;
      const cellDate = new Date(value);

      cell.classList.remove('rangepicker__selected-from');
      cell.classList.remove('rangepicker__selected-between');
      cell.classList.remove('rangepicker__selected-to');

      if (from && value === from.toISOString()) {
        cell.classList.add('rangepicker__selected-from');
      } else if (to && value === to.toISOString()) {
        cell.classList.add('rangepicker__selected-to');
      } else if (from && to && cellDate >= from && cellDate <= to) {
        cell.classList.add('rangepicker__selected-between');
      };
    }
  };

  onDayClick(target) {
    const { value } = target.dataset;
    if (!value) return;
    // convert to date
    const dateVal = new Date(value);
    // Если была выбрана дата то берем как начало или проставляем конец
    if (this.isSelect) {
        this.selected.from = dateVal;
        this.selected.to = null;
        this.isSelect = false;
    } else {
        this.selected.to = (dateVal > this.selected.from) ? dateVal : this.selected.from;
        this.selected.from = (dateVal < this.selected.from) ? dateVal : this.selected.from;
        this.isSelect = true;
      };

    this.renderHighlight();

    if (this.isSelect){
      this.close();
      this.subElements.from.innerHTML = this.formatDate(this.selected.from);
      this.subElements.to.innerHTML = this.formatDate(this.selected.to);
    };
  };

  remove() {
    this.element.remove();
    document.removeEventListener('click', this.onClickDoc, true);
  };

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  };
}
