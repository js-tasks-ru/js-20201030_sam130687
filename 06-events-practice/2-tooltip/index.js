class Tooltip {
  static instance;

  constructor() {
    if (this.instance) {
      return;
    }
    this.instance = this;
    this.render();
    this.handler = this.handler.bind(this);
  }

  handler(event) {
     this.textNode = event.target.closest('[data-tooltip]'); //dic
     const attributeValue = this.textNode.getAttribute('data-tooltip');

    if (event.type == 'pointerover') {
      this.render(attributeValue);
      this.element.style.left = event.clientX + 'px';
      this.element.style.top = event.clienty + 'px';
    }
    if (event.type == 'pointerout') {
        this.element.remove();
        this.textNode = null;
    }
  }

  addListener(){
    document.body.addEventListener( "pointerover" , this.handler);
    document.body.addEventListener( "pointerout" , this.handler);
  };

  render(text) {
    let el = document.createElement('div');
    el.innerHTML = this.getTemplate(text);
    this.element = el.firstElementChild;
    document.body.append(this.element);
  }

  initialize(){
    this.addListener();
  };

  getTemplate(text) {
    return `<div class="tooltip">${text}</div>`;
  };

  remove () {
    document.body.removeEventListener( "pointerover" , this.handler);
    document.body.removeEventListener( "pointerout" , this.handler);
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
};

const tooltip = new Tooltip();

export default tooltip;
