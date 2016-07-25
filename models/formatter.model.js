module.exports = class Formatter {
  constructor(parser) {
    this.parser = parser;
  }
  
  format(data) {
    return this.parser(data);
  }
};
