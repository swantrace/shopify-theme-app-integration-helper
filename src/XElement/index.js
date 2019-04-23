const XElement = function(htmlElement) {
  this.element = htmlElement;
  this.init();
};

XElement.prototype.init = function() {
  for (let key in this.element) {
    if (typeof this.element[key] === "function") {
      XElement.prototype[key] = this.element[key].bind(this.element);
    } else {
      let value = this.element[key];
      let element = this.element;
      Object.defineProperty(this, key, {
        enumerable: true,
        get: function() {
          return value;
        },
        set: function(newValue) {
          value = newValue;
          element[key] = newValue;
        }
      });
    }
  }
};

module.exports = XElement;
