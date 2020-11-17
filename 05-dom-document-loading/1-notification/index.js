export default class NotificationMessage {
  static activeNotification;

  constructor(label = '',
              {
                duration = 1000,
                type = 'success'
              } = {}) {

    if (NotificationMessage.activeNotification){
      NotificationMessage.activeNotification.remove();
    }
    this.label = label;
    this.duration = duration;
    this.type = type;
    this._createNode();
    NotificationMessage.activeNotification = this.element;
  }

  _createNode() {
    let el = document.createElement('div');
    el.innerHTML = this.template;
    this.element = el.firstElementChild;
  };

  show(inNode = document.body){
    inNode.append(this.element);
    setTimeout(() => this.remove(), this.duration);
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
    NotificationMessage.activeNotification = null;
  }
}
