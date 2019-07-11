const Sizzle = require("sizzle");

const { throttle, fragmentFromString } = require("../Helpers/index");

const find = function(elem, selector) {
  return Sizzle(selector, elem);
};

const matches = function(elem, selector) {
  return Sizzle.matchesSelector(elem, selector);
};

const children = function(elem, selector) {
  if (selector) {
    return find(selector, elem);
  } else {
    return elem.children;
  }
};

const siblings = function(elem, selector) {
  return Array.from(elem.parentNode.children).filter(function(child) {
    return child !== elem && (!selector || matches(child, selector));
  });
};

const prevAll = function(elem, selector) {
  let sibs = [];
  while ((elem = elem.previousSibling)) {
    if (elem.nodeType === 3) continue;
    if (!selector || matches(elem, selector)) sibs.push(elem);
  }
  return sibs;
};

const nextAll = function(elem, selector) {
  var sibs = [];
  var nextElem = elem.parentNode.firstChild;
  do {
    if (nextElem.nodeType === 3) continue;
    if (nextElem === elem) continue;
    if (nextElem === elem.nextElementSibling) {
      if (!selector || matches(nextElem, selector)) {
        sibs.push(nextElem);
        elem = nextElem;
      }
    }
  } while ((nextElem = nextElem.nextSibling));
  return sibs;
};

const parents = function(elem, selector) {
  var parents = [];
  el = elem.parentElement;
  while (el) {
    if (selector) {
      if (matches(el, selector)) {
        parents.push(el);
      }
    } else {
      parents.push(el);
    }
    el = el.parentElement;
  }
  return parents;
};

const removeAttributesExcept = function(elem, attributeNames = []) {
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
};

const wrap = function(elem, selector, wrapper) {
  var elms = find(selector, elem);
  if (!elms.length) {
    elms = [elms];
  }

  for (var i = elms.length - 1; i >= 0; i--) {
    var child = i > 0 ? wrapper.cloneNode(true) : wrapper;
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
};

const wrapAll = function(elem, selector, wrapper) {
  var elms = find(selector, elem);
  var el = elms.length ? elms[0] : elms,
    parent = el.parentNode,
    sibling = el.nextSibling;

  wrapper.appendChild(el);

  while (elms.length) {
    wrapper.appendChild(elms[0]);
  }

  if (sibling) {
    parent.insertBefore(wrapper, sibling);
  } else {
    parent.appendChild(wrapper);
  }
};

const dispatchCustomEvent = function(elem, eventName, detail) {
  var event = new CustomEvent(eventName, { detail: detail });
  elem.dispatchEvent(event);
};

const watch = function(
  elem,
  selector,
  callback = function(...args) {
    console.log(args);
  },
  interval = 200,
  times = Number.MAX_SAFE_INTEGER
) {
  var oldOuterHTML = elem.outerHTML;
  elem.addEventListener("domChanged", throttle(onDomChanged, interval));
  const observer = new MutationObserver(function() {
    dispatchCustomEvent(elem, "domChanged");
  });
  observer.observe(elem, {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true
  });
  dispatchCustomEvent(elem, "domChanged");
  function onDomChanged(e) {
    const relatedElements = find(elem, selector);
    if (relatedElements.length > 0) {
      times -= 1;
      if (times == 0) {
        observer.disconnect();
        observer = null;
      }
      callback(relatedElements, oldOuterHTML);
      oldOuterHTML = elem.outerHTML;
    }
  }
};

module.exports = {
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
};
