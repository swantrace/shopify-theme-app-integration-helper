import Sizzle from "sizzle";

export default {
  find(elem, selector) {
    return Sizzle(selector, elem);
  },
  empty(elem) {
    while (elem.hasChildNodes()) {
      elem.removeChild(elem.lastChild);
    }
  },
  remove(elem) {
    return elem.parentNode.removeChild(elem);
  },
  removeClass(elem, className) {
    elem.classList.remove(className);
  },
  matches(elem, selector) {
    return Sizzle.matchesSelector(elem, selector);
  },
  children(elem, selector) {
    if (selector) {
      return find(selector, elem);
    } else {
      return elem.children;
    }
  },
  siblings(elem, selector) {
    return Array.from(elem.parentNode.children).filter(function(child) {
      return child !== elem && (!selector || this.matches(child, selector));
    });
  },
  prevAll(elem, selector) {
    let sibs = [];
    while ((elem = elem.previousSibling)) {
      if (elem.nodeType === 3) continue;
      if (!selector || this.matches(elem, selector)) sibs.push(elem);
    }
    return sibs;
  },
  nextAll(elem, selector) {
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
  },
  parents(elem, selector) {
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
  },
  removeAttributesExcept(elem, attributeNames = []) {
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
  },
  wrap(elem, selector, wrapper) {
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
  },
  wrapAll(elem, selector, wrapper) {
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
  },
  dispatchCustomEvent(elem, eventName, detail) {
    var event = new CustomEvent(eventName, { detail: detail });
    elem.dispatchEvent(event);
  }
};
