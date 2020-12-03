import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
    element;
    subElements = {};
    components = {};

    async render () {
      const element = document.createElement('div');
  
      element.innerHTML = this.template;
  
      this.element = element.firstElementChild;
      this.subElements = this.getBodyElements(this.element);
  
      await this.initComponents();  
      this.renderComponents();
      this.initEventListeners();
  
      return this.element;
    };

    get template () {
        return `<div class="dashboard">
          <div class="content__top-panel">
            <h2 class="page-title">Dashboard</h2>
            <!-- RangePicker component -->
            <div data-element="rangePicker"></div>
          </div>
          <div data-element="chartsRoot" class="dashboard__charts">
            <!-- column-chart components -->
            <div data-element="ordersChart" class="dashboard__chart_orders"></div>
            <div data-element="salesChart" class="dashboard__chart_sales"></div>
            <div data-element="customersChart" class="dashboard__chart_customers"></div>
          </div>
          <h3 class="block-title">Best sellers</h3>
          <div data-element="sortableTable">
            <!-- sortable-table component -->
          </div>
        </div>`;
    };    
    
    getBodyElements(element) {
        const elementAggregator = {};
        Array.from(element.querySelectorAll('[data-element]')).forEach(item => {
        elementAggregator[item.dataset.element] = item;
        });
        return elementAggregator;
    };

    async initComponents () {
        const to = new Date();
        const from = new Date(); 
        from.setMonth(from.getMonth()-1);
        const range = {from, to};

        this.components.rangePicker = new RangePicker(range);
    
        this.components.sortableTable = new SortableTable(header, {
          url: `api/dashboard/bestsellers?_start=1&_end=20&from=${from.toISOString()}&to=${to.toISOString()}`,
          isSortLocally: true
        }); 
    
        this.components.ordersChart = new ColumnChart({
          url: 'api/dashboard/orders',
          range,
          label: 'orders',
          link: '#'
        });
    
        this.components.salesChart = new ColumnChart({
          url: 'api/dashboard/sales',
          label: 'sales',
          range
        });
    
        this.components.customersChart = new ColumnChart({
          url: 'api/dashboard/customers',
          label: 'customers',
          range
        });
    };

    renderComponents () {
      Object.keys(this.components).forEach(component => {
        const el = this.subElements[component];
        const { element } = this.components[component];
        el.append(element);
      });
    };
    
    initEventListeners () {
        this.components.rangePicker.element.addEventListener('date-select', event => {
          const { from, to } = event.detail;
    
          this.updateComponents(from, to);
        });
    };

    async updateComponents (from, to) {
      const data = await fetchJson(`${BACKEND_URL}api/dashboard/bestsellers?_start=1&_end=20&from=${from.toISOString()}&to=${to.toISOString()}`);
  
      this.components.sortableTable.addRows(data);
  
      this.components.ordersChart.update(from, to);
      this.components.salesChart.update(from, to);
      this.components.customersChart.update(from, to);
    };
  
    remove () {
      this.element.remove();
    };
  
    destroy () {
      this.remove();
  
      for (const component of Object.values(this.components)) {
        component.destroy();
      };
    };
  }
