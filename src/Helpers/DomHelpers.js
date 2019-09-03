import Sizzle from "sizzle";
import { isNode, createFragmentFromString } from "./Utilities";
import camelCase from "lodash.camelcase";

// 1. Selector
function find(elem, filter) {
  let children = [];
  if (typeof filter === "string") {
    children = Sizzle(filter, elem);
  }
  if (typeof filter === "function") {
    children = Array.from(elem.children).filter(filter);
  }
  return children;
}
function matches(elem, filter) {
  if (typeof filter === "string") {
    return Sizzle.matchesSelector(elem, filter);
  }
  if (typeof filter === "function") {
    return filter(elem);
  }
  return false;
}
// 2. Tree Traversing
function first(elem, filter) {
  return { elem, filter };
}
function last(elem, filter) {
  return { elem, filter };
}
function children(elem, filter) {
  if (filter) {
    return find(elem, filter);
  } else {
    return elem.children;
  }
}
function siblings(elem, filter) {
  return Array.from(elem.parentNode.children).filter(function(child) {
    return (
      child !== elem &&
      (!filter ||
        (typeof filter === "string" && matches(child, filter)) ||
        (typeof filter === "function" && filter(child)))
    );
  });
}
function prev(elem, filter) {
  while ((elem = elem.previousElementSibling)) {
    if (!filter || matches(elem, filter)) {
      return elem;
    }
  }
  return null;
}
function next(elem, filter) {
  var nextElem = elem.parentNode.firstElementChild;
  do {
    if (nextElem === elem) {
      continue;
    }
    if (nextElem === elem.nextElementSibling) {
      if (!filter || matches(elem, filter)) {
        return nextElem;
      }
    }
  } while ((nextElem = nextElem.nextElementSibling));
  return null;
}
function prevAll(elem, filter) {
  let sibs = [];
  while ((elem = elem.previousElementSibling)) {
    if (!filter || matches(elem, filter)) {
      sibs.push(elem);
    }
  }
  return sibs;
}
function nextAll(elem, filter) {
  var sibs = [];
  var nextElem = elem.parentNode.firstElementChild;
  do {
    if (nextElem === elem) {
      continue;
    }
    if (nextElem === elem.nextElementSibling) {
      if (!filter || matches(elem, filter)) {
        sibs.push(nextElem);
        elem = nextElem;
      }
    }
  } while ((nextElem = nextElem.nextSibling));
  return sibs;
}
function parents(elem, filter) {
  var parents = [];
  var el = elem.parentElement;
  while (el) {
    if (!filter || matches(elem, filter)) {
      parents.push(el);
    }
    el = el.parentElement;
  }
  return parents;
}
function parentsUntil(elem, filter) {
  const result = [];
  elem = elem.parentElement;
  while (elem && !matches(elem, filter)) {
    if (!filter) {
      result.push(elem);
    } else {
      if (matches(elem, filter)) {
        result.push(elem);
      }
    }
    elem = elem.parentElement;
  }
  return result;
}
function parent(elem, filter) {
  let el = elem.parentElement;
  while (el) {
    if (!filter || matches(elem, filter)) {
      return el;
    }
    el = el.parentElement;
  }
  return el;
}
// 3. Manipulation
// a. Class Attribute
function removeClass(elem, ...classNames) {
  elem.classList.remove(...classNames);
  return elem;
}
function addClass(elem, ...classNames) {
  elem.classList.add(...classNames);
  return elem;
}
function hasClass(elem, className) {
  return elem.classList.contains(className);
}
function toggleClass(elem, className) {
  elem.classList.toggle(className);
}
function replaceClass(elem, oldClass, newClass) {
  elem.classList.replace(oldClass, newClass);
  return elem;
}
// b. DOM Removal
function empty(elem) {
  while (elem.hasChildNodes()) {
    elem.removeChild(elem.lastChild);
  }
  return elem;
}
function remove(elem) {
  return elem.parentNode.removeChild(elem);
}
function unwrapEachChild(elem, selector) {
  var elms = find(selector, elem);
  elms.forEach(el => {
    let elParentNode = el.parentNode;
    if (elParentNode !== document.body) {
      elParentNode.parentNode.insertBefore(el, elParentNode);
      elParentNode.parentNode.removeChild(elParentNode);
    }
  });
  return elem;
}
// c. DOM Replacement
function replaceWith(elem, selector, newEl) {
  var elms = find(selector, elem);
  elms.forEach(el => {
    if (typeof newEl === "string") {
      newEl = createFragmentFromString(newEl);
    }
    el.parentNode.insertBefore(newEl, el);
    el.parentNode.removeChild(el);
  });
  return elem;
}
// d. DOM Insertion
function after(elem, newEl) {
  if (elem.parentNode) {
    if (typeof newEl === "string") {
      newEl = createFragmentFromString(newEl);
    }
    if (!isNode(newEl)) {
      return false;
    }
    elem.parentNode.insertBefore(newEl, elem.nextSibling);
    return elem.parentNode;
  } else {
    return false;
  }
}
function before(elem, newEl) {
  if (elem.parentNode) {
    if (typeof newEl === "string") {
      newEl = createFragmentFromString(newEl);
    }
    if (!isNode(newEl)) {
      return false;
    }
    elem.parentNode.insertBefore(newEl, elem);
    return elem.parentNode;
  } else {
    return false;
  }
}
function appendTo(elem, target) {
  target.appendChild(elem);
  return elem.parentNode;
}
function prependTo(elem, target) {
  target.insertBefore(elem, target.firstChild);
  return elem.parentNode;
}
function append(elem, ...targets) {
  elem.append(...targets);
  return elem;
}
function prepend(elem, ...targets) {
  elem.prepend(...targets);
  return elem;
}
function insertBefore(elem, target) {
  return { elem, target };
}
function insertAfter(elem, target) {
  return { elem, target };
}
function wrapEachChildWith(elem, selector, wrappingElement) {
  var elms = find(selector, elem);
  if (!elms.length) {
    elms = [elms];
  }
  if (typeof wrappingElement === "string") {
    wrappingElement = createFragmentFromString(wrappingElement);
  }
  if (!isNode(wrappingElement)) {
    return false;
  }
  try {
    for (var i = elms.length - 1; i >= 0; i--) {
      var child = i > 0 ? wrappingElement.cloneNode(true) : wrappingElement;
      var el = elms[i];
      var parent = el.parentNode;
      var sibling = el.nextSibling;
      child.appendChild(el);
      if (sibling) {
        parent.insertBefore(child, sibling);
      } else {
        parent.appendChild(child);
      }
    }
  } catch (error) {
    return false;
  }
}
function wrapAllChildrenWith(elem, selector, wrappingElement) {
  var elms = find(selector, elem);
  var el = elms.length ? elms[0] : elms;
  var parent = el.parentNode;
  var sibling = el.nextSibling;
  if (typeof wrappingElement === "string") {
    wrappingElement = createFragmentFromString(wrappingElement);
  }
  wrappingElement.appendChild(el);
  while (elms.length) {
    wrappingElement.appendChild(elms[0]);
  }

  if (sibling) {
    parent.insertBefore(wrappingElement, sibling);
  } else {
    parent.appendChild(wrappingElement);
  }
}
// 4. Attributes
// todo: make css, attr and date function can accept one object
function css(elem, stylePropertyName, stylePropertyValue) {
  if (arguments.length === 2) {
    const win = elem.ownerDocument.defaultView;
    return win.getComputedStyle(elem, null)[stylePropertyName];
  }
  if (arguments.length === 3) {
    elem.style.setProperty(stylePropertyName, stylePropertyValue);
    const win = elem.ownerDocument.defaultView;
    return win.getComputedStyle(elem, null)[stylePropertyName];
  }
}
function attr(elem, propertyName, propertyValue) {
  if (arguments.length === 2) {
    return elem.getAttribute(propertyName);
  }
  if (arguments.length === 3) {
    elem.setAttribute(propertyName, propertyValue);
    return elem.getAttribute(propertyName);
  }
}
function removeAttrExcept(elem, attributeNames = []) {
  Array.from(elem.attributes)
    .map(function(attribute) {
      return attribute.nodeName;
    })
    .filter(function(attributeName) {
      return !attributeNames.includes(attributeName);
    })
    .forEach(function(attributeName) {
      elem.removeAttribute(attributeName);
    });
  return elem;
}
function removeAttr(elem, attributeNames = []) {
  attributeNames.forEach(function(attributeName) {
    elem.removeAttribute(attributeName);
  });
  return elem;
}
function data(elem, dataAttributeName, dataAttributeValue) {
  if (arguments.length === 2) {
    const value = elem.getAttribute(`data-${dataAttributeName}`);
    elem.dataset[camelCase(dataAttributeName)] = value;
    return value;
  }
  if (arguments.length === 3) {
    elem.setAttribute(`data-${dataAttributeName}`, dataAttributeValue);
    elem.dataset[camelCase(dataAttributeName)] = dataAttributeValue;
    return dataAttributeValue;
  }
}
// 5. Form
// to do: finish fdObj and val function
function fdObj() {
  return null;
}
function val() {
  return null;
}
// 6. Effect
function show(elem) {
  if (window.getComputedStyle(elem).getPropertyValue("display") === "none") {
    if (elem.getAttribute("data-x-original-display-value") === null) {
      elem.style.setProperty("display", "block");
    } else if (elem.getAttribute("data-x-original-display-value") !== "none") {
      elem.style.setProperty(
        "display",
        elem.getAttribute("data-x-original-display-value")
      );
      elem.removeAttribute("data-x-original-display-value");
    } else {
      elem.removeAttribute("data-x-original-display-value");
    }
  }
  return elem;
}
function hide(elem) {
  if (window.getComputedStyle(elem).getPropertyValue("display") !== "none") {
    elem.setAttribute(
      "data-x-original-display-value",
      window.getComputedStyle(elem).getPropertyValue("display")
    );
    elem.style.setProperty("display", "none");
  }
  return elem;
}
function toggle(elem) {
  if (window.getComputedStyle(elem).getPropertyValue("display") !== "none") {
    hide(elem);
  } else {
    show(elem);
  }
  return elem;
}
function fadeIn(elem, duration) {
  elem.style.transition = `opacity ${duration / 1000}s`;
  elem.style.opacity = "1";
  return elem;
}
function fadeOut(elem, duration) {
  elem.style.transition = `opacity ${duration / 1000}s`;
  elem.style.opacity = "0";
  return elem;
}
function fadeTo(elem, duration, targetOpacity) {
  elem.style.transition = `opacity ${duration / 1000}s`;
  elem.style.opacity = targetOpacity;
  return elem;
}
function fadeToggle(elem, duration) {
  elem.style.transition = `opacity ${duration / 1000}s`;
  const { opacity } = elem.ownerDocument.defaultView.getComputedStyle(
    elem,
    null
  );
  if (opacity === "1") {
    elem.style.opacity = "0";
  } else {
    elem.style.opacity = "1";
  }
}
function slideUp(elem, duration, callback) {
  elem.style.height = elem.offsetHeight + "px";
  elem.style.transitionProperty = "height, margin, padding";
  elem.style.transitionDuration = duration + "ms";
  elem.offsetHeight;
  elem.style.overflow = "hidden";
  elem.style.height = 0;
  elem.style.paddingTop = 0;
  elem.style.paddingBottom = 0;
  elem.style.marginTop = 0;
  elem.style.marginBottom = 0;
  window.setTimeout(function() {
    elem.style.display = "none";
    elem.style.removeProperty("height");
    elem.style.removeProperty("padding-top");
    elem.style.removeProperty("padding-bottom");
    elem.style.removeProperty("margin-top");
    elem.style.removeProperty("margin-bottom");
    elem.style.removeProperty("overflow");
    elem.style.removeProperty("transition-duration");
    elem.style.removeProperty("transition-property");
    "function" == typeof callback && callback(elem);
  }, duration);
}
function slideDown(elem, duration, callback) {
  elem.style.removeProperty("display");
  var display = window.getComputedStyle(elem).display;
  if (display === "none") {
    display = "block";
  }
  elem.style.display = display;
  var height = elem.offsetHeight;
  elem.style.overflow = "hidden";
  elem.style.height = 0;
  elem.style.paddingTop = 0;
  elem.style.paddingBottom = 0;
  elem.style.marginTop = 0;
  elem.style.marginBottom = 0;
  elem.offsetHeight;
  elem.style.transitionProperty = "height, margin, padding";
  elem.style.transitionDuration = duration + "ms";
  elem.style.height = height + "px";
  elem.style.removeProperty("padding-top");
  elem.style.removeProperty("padding-bottom");
  elem.style.removeProperty("margin-top");
  elem.style.removeProperty("margin-bottom");
  window.setTimeout(function() {
    elem.style.removeProperty("height");
    elem.style.removeProperty("overflow");
    elem.style.removeProperty("transition-duration");
    elem.style.removeProperty("transition-property");
    "function" == typeof callback && callback(elem);
  }, duration);
}
function animate(elem) {
  return elem;
}
// Event
function dispatchCustomEvent(elem, eventName, detail) {
  var event = new CustomEvent(eventName, { detail: detail });
  elem.dispatchEvent(event);
}
// parseHTML
function parseHTML(string) {
  const context = document.implementation.createHTMLDocument();
  const base = context.createElement("base");
  base.href = document.location.href;
  context.head.appendChild(base);
  context.body.innerHTML = string;
  return context.body.children;
}

export {
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
  first,
  last,
  prev,
  next,
  prevAll,
  nextAll,
  parents,
  parentsUntil,
  parent,
  removeAttr,
  removeAttrExcept,
  fdObj,
  val,
  append,
  prepend,
  insertBefore,
  insertAfter,
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
  fadeTo,
  fadeToggle,
  slideDown,
  slideUp,
  css,
  attr,
  data,
  parseHTML,
  animate
};
