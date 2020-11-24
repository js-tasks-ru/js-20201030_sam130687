import fetchCustom from "./utils/fetch-json.js";
const baseLink = 'https://course-js.javascript.ru/';

export default class ColumnChart {
  chartHeight = 50;
  subElements = {};
  constLink = `\n <a href="${this.link}" class="column-chart__link">View all</a>`;

  constructor({
                url = '',
                range = {
                  from: new Date(),
                  to: new Date(),
                },
                label = '',
                link = '',
                formatHeading= data => data
              } = {}) {
    this.url = new URL(url, baseLink);
    this.from = range.from;
    this.to = range.to;
    this.label = label;
    this.formatHeading = formatHeading;
    this.link = link;
    this.render();
    this.loadData(this.from, this.to);
  }

  getLink() {
    return this.link ? this.constLink : '';
  }

  get template() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">Total ${this.label} ${this.getLink()}</div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header"></div>
          <div data-element="body" class="column-chart__chart"></div>
        </div>
      </div>
    `;
  };

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    this.subElements = this.getBodyElements(this.element);
  };

  getBodyElements(element) {
    const elementAggregator = {};
    Array.from(element.querySelectorAll('[data-element]')).forEach(item => {
      elementAggregator[item.dataset.element] = item;
    });
    return elementAggregator;
  };

  async loadData(from, to){
    this.element.classList.add('column-chart_loading');
    this.subElements.header.textContent = '';
    this.subElements.body.innerHTML = '';

    this.url.searchParams.set('from', this.from);
    this.url.searchParams.set('to', this.to);

    const data = await fetchCustom(this.url);

    if (data && Object.values(data).length) {
      this.subElements.header.textContent = this.getHeaderValue(data);
      this.subElements.body.innerHTML = this.getColumnBody(data);
      this.element.classList.remove('column-chart_loading');
    };
  };

  getHeaderValue(data) {
    return this.formatHeading(Object.values(data).reduce((sum, item) => (sum + item), 0));
  };

  getColumnBody(data) {
    const maxValue = Math.max(...Object.values(data));
    return Object.entries(data).map(([key, value]) => {
      const scale = Math.floor(value / maxValue * this.chartHeight);
      const percent = Math.round(value / maxValue * 100);
      return `<div style="--value: ${scale}" data-tooltip="${percent}%"></div>`;
    }).join('');
  };

  async update(from, to) {
    this.from = from;
    this.to = to;
    return await this.loadData(from, to);
  };

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
};
