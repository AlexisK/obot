module.exports = class Connection {
  constructor(name, connectFn) {
    Object.assign(this, {
      name, connectFn
    });
  }

  connect() {
    return this.connectFn();
  }
};
