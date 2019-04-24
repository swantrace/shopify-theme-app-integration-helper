require("babel-polyfill");
const XElement = require("./XElement/index");
const { bindData, define } = require("./TinybindElement/index");
const {
  find,
  matches,
  children,
  siblings,
  prevAll,
  nextAll,
  parents,
  removeAttributesExcept,
  wrap,
  wrapAll,
  dispatchCustomEvent,
  watch
} = require("./DomHelper/index");

[
  bindData,
  onceElementsAppeared,
  onceElementsDisappeared,
  find,
  matches,
  children,
  siblings,
  prevAll,
  nextAll,
  parents,
  removeAttributesExcept,
  wrap,
  wrapAll,
  dispatchCustomEvent,
  watch
].forEach(function(fn) {
  XElement.prototype[fn.name] = function() {
    return fn(this.element, ...arguments);
  };
});

let X = (function() {
  var xHTMLElements = new WeakMap();
  return function(htmlElement) {
    if (xHTMLElements.has(htmlElement)) {
      return xHTMLElements.get(htmlElement);
    }
    var x = new XElement(htmlElement);
    xHTMLElements.set(htmlElement, x);
    return x;
  };
})();

X = Object.assign(X, {
  define,
  find: function(selector) {
    return X(document.documentElement).find(selector);
  }
});

module.exports = X;
