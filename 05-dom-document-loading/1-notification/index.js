export default class NotificationMessage {
  static justWork = false;

  constructor(label = '',
              {
                duration = 1000,
                type = 'success'
              } = {}) {
    this.label = label;
    this.duration = duration;
    this.type = type;
    this._createNode();
  }

  _createNode() {
    let el = document.createElement('div');
    el.innerHTML = this.template;
    this.element = el.firstElementChild;
  };

  show(inNode){
    if (NotificationMessage.justWork) {
      return ;
    };

    if (inNode) {
      inNode.insertAdjacentHTML('afterbegin', this.element.outerHTML);
    } else {
      document.body.append(this.element);
      NotificationMessage.justWork = true;
      setTimeout(() => this._divRemove(), this.duration);
    };
  };

  _divRemove(){
    this.element.innerHTML = '';
    this.destroy();
    NotificationMessage.justWork = false;
  };

  get template() {
    return `<div class="notification ${this.type}" style="--value:${this.duration/1000}s">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.type}</div>
      <div class="notification-body">
        ${this.label}
      </div>
    </div>
  </div>`;
  };

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
