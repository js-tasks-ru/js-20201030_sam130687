export default class ColumnChart {
  chartHeight = 50;
  constHTML = `
        <div class="column-chart__title">
        </div>
        <div class="column-chart__container">
            <div data-element="body" class="column-chart__chart">
            </div>
        </div>
        `;
  constLink = `<a href="${this.link}" class="column-chart__link">View all</a>`;


  fillTitle(node) {
    if (Boolean(this.label)) {
      node.innerHTML = this.label;
    }

    if (Boolean(this.link)) {
      node.innerHTML += this.constLink;
    }
  };

  fillHeight(node) {
    if (Boolean(this.value)) {
      const header = `<div data-element="header" class="column-chart__header">${this.value}</div>`;
      node.innerHTML = header + node.innerHTML;
    }
  }

  genMainNode() {
    this.element = document.createElement('div');
    this.element.className = 'column-chart';

    this.element.innerHTML = this.constHTML;

    this.fillTitle(this.element.querySelector('.column-chart__title'));
    this.fillHeight(this.element.querySelector('.column-chart__container'))
  };

  genData() {
    if (this.data.length > 0) {
      const maxValue = Math.max(...this.data);
      const nodeBody = this.element.querySelector('.column-chart__chart');

      for (const item of this.data) {
        nodeBody.innerHTML += `<div style="--value: ${Math.floor(item / maxValue * this.chartHeight)}"
                                      data-tooltip="${Math.round(item / maxValue * 100)}%">
                               </div>`;;
      }
    } else {
      this.element.className += ' column-chart_loading';
    }
  }

  constructor({
                data = [],
                label = '',
                link = '',
                value = 0
              } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.render();
  }

  render() {
    this.genMainNode();
    this.genData();
  }

  update() {
    this.element.querySelector('.column-chart__chart').innerHTML = '';
    this.genData();
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
