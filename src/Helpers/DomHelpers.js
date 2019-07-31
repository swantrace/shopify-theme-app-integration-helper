import Sizzle from "sizzle";
import { isNode, createFragmentFromString } from "./Utilities";

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
function show(elem) {}
function hide(elem) {}
function toggle(elem) {}
function fadeIn(elem, duration) {}
function fadeOut(elem, duration) {}
function fadeTo(elem, duration) {}
function fadeToggle(elem, duration) {}
function slideUp(elem) {}
function slideDown(elem) {}
function slideToggle(elem) {}
function animate(elem) {}
function css(elem) {}
function attr(elem) {}
function data(elem) {}
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
  fadeToggle,
  slideDown,
  slideUp,
  slideToggle,
  animate,
  css,
  attr,
  data
};
