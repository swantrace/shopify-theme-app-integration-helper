import "core-js/stable";
import "regenerator-runtime/runtime";
import XElement from "./XElement";
import { html, define } from "./OmisElement";
import { Observable } from "../node_modules/object-observer/dist/object-observer";
import observe from "obajs";
import axios from "axios";

import {
  range,
  sendRequestsInParallel,
  sendRequestsInSeries,
  createFragmentFromString
} from "./Helpers/Utilities";
import {
  formatMoney,
  toggleCheckout,
  isValidATCForm,
  hideCheckoutButtons,
  showCheckoutButtonsHiddenByUs,
  quantityInputValuesInAgreementWithCartObject,
  toggleFocusInFocusOutEventListenersOfElement,
  addCSS,
  addJS,
  blockScripts,
  onScriptsLoaded,
  affirmUpdatePrice,
} from "./Helpers/ShopifyGeneralHelpers";
import {
  find,
  empty,
  after,
  before,
  appendTo,
  prependTo,
  remove,
  removeClass,
  addClass,
  hasClass,
  toggleClass,
  replaceClass,
  matches,
  children,
  siblings,
  prevAll,
  nextAll,
  parents,
  removeAttributesExcept,
  wrapEachChildWith,
  wrapAllChildrenWith,
  unwrapEachChild,
  replaceWith,
  dispatchCustomEvent,
  show,
  hide,
  toggle,
  fadeIn,
  fadeOut,
  fadeToggle,
  slideDown,
  slideUp,
  slideToggle,
  animate,
  css,
  attr,
  data,
  parseHTML
} from "./Helpers/DomHelpers";
import {
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
} from "./DOMObserver";
import ShopifyAPI from "./ShopifyAPI";

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
  [find, "find"],
  [matches, "matches"],
  [empty, "empty"],
  [remove, "remove"],
  [removeClass, "removeClass"],
  [removeAttributesExcept, "removeAttributesExcept"],
  [children, "children"],
  [siblings, "siblings"],
  [prevAll, "prevAll"],
  [nextAll, "nextAll"],
  [parents, "parents"],
  [after, "after"],
  [before, "before"],
  [appendTo, "appendTo"],
  [prependTo, "prependTo"],
  [addClass, "addClass"],
  [hasClass, "hasClass"],
  [toggleClass, "toggleClass"],
  [replaceClass, "replaceClass"],
  [wrapEachChildWith, "wrapEachChildWith"],
  [wrapAllChildrenWith, "wrapAllChildrenWith"],
  [unwrapEachChild, "unwrapEachChild"],
  [replaceWith, "replaceWith"],
  [show, "show"],
  [hide, "hide"],
  [toggle, "toggle"],
  [fadeIn, "fadeIn"],
  [fadeOut, "fadeOut"],
  [fadeToggle, "fadeToggle"],
  [slideDown, "slideDown"],
  [slideUp, "slideUp"],
  [slideToggle, "slideToggle"],
  [animate, "animate"],
  [css, "css"],
  [attr, "attr"],
  [data, "data"],
  [dispatchCustomEvent, "dispatchCustomEvent"],
  [
    toggleFocusInFocusOutEventListenersOfElement,
    "toggleFocusInFocusOutEventListenersOfElement"
  ]
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
  observe,
  axios,
  enObservable: Observable.from,
  define,
  html,
  find,
  range,
  addCSS,
  addJS,
  isValidATCForm,
  sendRequestsInParallel,
  sendRequestsInSeries,
  formatMoney,
  blockScripts,
  onScriptsLoaded,
  affirmUpdatePrice,
  hideCheckoutButtons,
  showCheckoutButtonsHiddenByUs,
  quantityInputValuesInAgreementWithCartObject,
  toggleCheckout,
  createFragmentFromString,
  parseHTML
});

module.exports = X;
