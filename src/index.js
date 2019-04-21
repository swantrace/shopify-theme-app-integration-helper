const XElement = require('./XElement/index');
const {bind, define} = require('./TinybindElement/index');
const {onceElementsAppeared, onceElementsDisappeared} = require('./DomObserver/index');
const {siblings, prev, next, prevAll} = require('./jQueryAlike/index');

XElement.prototype.onceElementsAppeared = onceElementsAppeared;
XElement.prototype.onceElementsDisappeared = onceElementsDisappeared;
XElement.prototype.siblings = siblings;
XElement.prototype.prev = prev;
XElement.prototype.next = next;
XElement.prototype.prevAll = prevAll;
XElement.prototype.bind = bind;

let X = (function(){
  var xHTMLElements = new WeakMap();
  return (function(htmlElement){
    if(xHTMLElements.has(htmlElement)){
      return xHTMLElements.get(htmlElement);
    }
    var x = new XElement(htmlElement);
    xHTMLElements.set(htmlElement, x);
    return x;
  });
})();

X = Object.assign(X, {
  define
});

module.exports = X;
