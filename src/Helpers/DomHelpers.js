import Sizzle from "sizzle";
import { isNode, createFragmentFromString } from "./Utilities";
import camelCase from "lodash.camelcase";

function find(elem, selector) {
  return Sizzle(selector, elem);
}
function empty(elem) {
  while (elem.hasChildNodes()) {
    elem.removeChild(elem.lastChild);
  }
  return elem;
}
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
function remove(elem) {
  return elem.parentNode.removeChild(elem);
}
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
function matches(elem, selector) {
  return Sizzle.matchesSelector(elem, selector);
}
function children(elem, selector) {
  if (selector) {
    return find(selector, elem);
  } else {
    return elem.children;
  }
}
function siblings(elem, selector) {
  return Array.from(elem.parentNode.children).filter(function(child) {
    return child !== elem && (!selector || this.matches(child, selector));
  });
}
function prevAll(elem, selector) {
  let sibs = [];
  while ((elem = elem.previousSibling)) {
    if (elem.nodeType === 3) continue;
    if (!selector || this.matches(elem, selector)) sibs.push(elem);
  }
  return sibs;
}
function nextAll(elem, selector) {
  var sibs = [];
  var nextElem = elem.parentNode.firstChild;
  do {
    if (nextElem.nodeType === 3) continue;
    if (nextElem === elem) continue;
    if (nextElem === elem.nextElementSibling) {
      if (!selector || this.matches(nextElem, selector)) {
        sibs.push(nextElem);
        elem = nextElem;
      }
    }
  } while ((nextElem = nextElem.nextSibling));
  return sibs;
}
function parents(elem, selector) {
  var parents = [];
  var el = elem.parentElement;
  while (el) {
    if (selector) {
      if (this.matches(el, selector)) {
        parents.push(el);
      }
    } else {
      parents.push(el);
    }
    el = el.parentElement;
  }
  return parents;
}
function removeAttributesExcept(elem, attributeNames = []) {
  Array.from(elem.attributes)
    .map(function(attribute) {
      return attribute.nodeName;
    })
    .filter(function(attributeName) {
      return !attributeNames.includes(attributeName);
    })
    .forEach(function(attributeName) {
      this.removeAttribute(attributeName);
    });
  return elem;
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
function dispatchCustomEvent(elem, eventName, detail) {
  var event = new CustomEvent(eventName, { detail: detail });
  elem.dispatchEvent(event);
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
  fadeTo,
  fadeToggle,
  slideDown,
  slideUp,
  css,
  attr,
  data
};
