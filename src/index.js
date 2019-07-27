import XElement from "./XElement";

import { bindData, define } from "./TinybindElement";

import {
  range,
  sendRequestsInParallel,
  sendRequestsInSeries,
  formatMoney,
  addcss,
  hideCheckoutButtons,
  showCheckoutButtonsHiddenByUs,
  quantityInputValuesInAgreementWithCartObject,
  toggleCheckout,
  toggleFocusInFocusOutEventListenersOfElement
} from "./Helpers/ShopifyGeneralHelpers";

import ProductOptions from "./Bold/ProductOptions";
import QuantityBreaks from "./Bold/QuantityBreaks";
import CustomPricing from "./Bold/CustomPricing";
import Memberships from "./Bold/Memberships";
import Multicurrency from "./Bold/Multicurrency";
import ProductBuilder from "./Bold/ProductBuilder";
import ProductBundles from "./Bold/ProductBundles";
import ProductDiscount from "./Bold/ProductDiscount";
import ProductUpsell from "./Bold/ProductUpsell";
import RecurringOrders from "./Bold/RecurringOrders";
import SalesMotivator from "./Bold/SalesMotivator";
import StoreLocator from "./Bold/StoreLocator";

import {
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
  dispatchCustomEvent
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

import {
  getCart,
  getProduct,
  clearCart,
  updateCartFromForm,
  changeItemByKey,
  removeItemByKey,
  changeItemByLine,
  removeItemByLine,
  addItem,
  addItemFromForm
} from "./ShopifyAPI";

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
  define,
  find,
  range,
  addcss,
  sendRequestsInParallel,
  sendRequestsInSeries,
  formatMoney,
  po: ProductOptions,
  qb: QuantityBreaks,
  csp: CustomPricing,
  mem: Memberships,
  mc: Multicurrency,
  builder: ProductBuilder,
  bundles: ProductBundles,
  pd: ProductDiscount,
  pu: ProductUpsell,
  ro: RecurringOrders,
  tm: SalesMotivator,
  locator: StoreLocator,
  getCart,
  getProduct,
  clearCart,
  updateCartFromForm,
  changeItemByKey,
  removeItemByKey,
  changeItemByLine,
  removeItemByLine,
  addItem,
  addItemFromForm,
  hideCheckoutButtons,
  showCheckoutButtonsHiddenByUs,
  quantityInputValuesInAgreementWithCartObject,
  toggleCheckout
});

module.exports = X;
