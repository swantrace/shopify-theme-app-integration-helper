const Sizzle = require("sizzle");

const find = function(elem, selector) {
  return Sizzle(selector, elem);
};

const children = function(elem, selector) {
  if (selector) {
    return Sizzle(selector, elem);
  } else {
    return elem.children;
  }
};

const matches = function(elem, selector) {
  return Sizzle.matchSelector(elem, selector);
};

const siblings = function(elem, selector) {
  return Array.from(elem.parentNode.children).filter(function(child) {
    return (
      child !== elem && (!selector || Sizzle.matchSelector(child, selector))
    );
  });
};

const prevAll = function(elem, selector) {
  let sibs = [];
  while ((elem = elem.previousSibling)) {
    if (elem.nodeType === 3) continue;
    if (!selector || Sizzle.matchSelector(elem, selector)) sibs.push(elem);
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
      if (!selector || Sizzle.matchSelector(nextElem, selector)) {
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
      if (Sizzle.matchSelector(el, selector)) {
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
  var elms = Sizzle(selector, elem);
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
  var elms = Sizzle(selector, elem);
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
  wrapAll
};
