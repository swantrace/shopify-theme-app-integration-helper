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

const {
  onceAttributeAdded,
  onceNodeAdded,
  onceTextAdded,
  onceAttributeRemoved,
  onceNodeRemoved,
  onceTextRemoved,
  onAttributeAdded,
  onAttributeRemoved,
  onNodeAdded,
  onNodeRemoved,
  onTextAdded,
  onTextRemoved
} = require("./DOMObserver/index");

const addFunctionToXElement = function(fn, fnName) {
  XElement.prototype[fnName] = function() {
    return fn(this.element, ...arguments);
  };
};

[
  [onceAttributeAdded, "onceAttributeAdded"],
  [onceNodeAdded, "onceNodeAdded"],
  [onceTextAdded, "onceTextAdded"],
  [onceAttributeRemoved, "onceAttributeRemoved"],
  [onceNodeRemoved, "onceNodeRemoved"],
  [onceTextRemoved, "onceTextRemoved"],
  [onAttributeAdded, "onAttributeAdded"],
  [onAttributeRemoved, "onAttributeRemoved"],
  [onNodeAdded, "onNodeAdded"],
  [onNodeRemoved, "onNodeRemoved"],
  [onTextAdded, "onTextAdded"],
  [onTextRemoved, "onTextRemoved"],
  [bindData, "bindData"],
  [find, "find"],
  [matches, "matches"],
  [removeAttributesExcept, "removeAttributesExcept"],
  [children, "children"],
  [siblings, "siblings"],
  [prevAll, "prevAll"],
  [nextAll, "nextAll"],
  [parents, "parents"],
  [wrap, "wrap"],
  [wrapAll, "wrapAll"],
  [dispatchCustomEvent, "dispatchCustomEvent"],
  [watch, "watch"]
].forEach(function([fn, fnName]) {
  addFunctionToXElement(fn, fnName);
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
