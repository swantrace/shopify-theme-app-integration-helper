const { find, matches } = require("../DomHelper");
const NODE = 1;
const ATTRIBUTE = 2;
const CHARACTERDATA = 3;
const ADD = 1;
const REMOVE = -1;

const _observeDom = function(elem, type, searchTerm, addOrRemove) {
  return new Promise((resolve, reject) => {
    if (
      !_isCSSSelector(searchTerm) &&
      !_isRegularExpression(searchTerm) &&
      !_isAttributeMap(searchTerm)
    ) {
      reject(
        new Error(
          "SearchTerm is not valid CSS selector, Regular Expression or Map"
        )
      );
    }
    const config = {
      subtree: true,
      childList: type === NODE,
      characterDataOldValue: type === CHARACTERDATA,
      attributeOldValue: type === ATTRIBUTE
    };

    if (type === ATTRIBUTE) {
      if (_isAttributeMap(searchTerm)) {
        config.attributeFilter = Array.from(searchTerm.keys());
      } else {
        reject(new Error("You can only use Map to observe attribute chanage"));
      }
    }

    if (type === CHARACTERDATA) {
      if (!_isRegularExpression(searchTerm)) {
        reject(
          new Error(
            "You can only use regular expression to observe characterdata change"
          )
        );
      }
    }

    const observer = new MutationObserver(mutationRecords => {
      let childNodes = [];
      let reducer;

      switch (type * addOrRemove) {
        case 1:
          reducer = _addNodeReducer;
          break;
        case 2:
          reducer = _addAttributeReducer;
          break;
        case 3:
          reducer = _addCharacterDataReducer;
          break;
        case -1:
          reducer = _removeNodeReducer;
          break;
        case -2:
          reducer = _removeAttributeReducer;
          break;
        case -3:
          reducer = _removeChracterDataReducer;
          break;
        default:
          reject(new Error(`type * addOrRemove = ${type * addOrRemove}`));
      }

      childNodes = mutationRecords.reduce(reducer, []);

      childNodes = childNodes.filter(function(node, index, nodes) {
        return nodes.indexOf(node) === index;
      });

      if (childNodes.length > 0) {
        observer.disconnect();
        resolve(childNodes);
      }
    });
    observer.observe(elem, config);
  });

  function _addAttributeReducer(acc, cur) {
    const { target, attributeName, oldValue } = cur;
    Array.from(searchTerm.entries()).forEach(nameValuePair => {
      const [name, value] = nameValuePair;
      if (attributeName == name) {
        let currentValue = target[name === "class" ? "className" : name];
        if (name === "style") {
          currentValue = currentValue.cssText;
        }
        if (
          (currentValue === value || currentValue.includes(value)) &&
          (!oldValue || (oldValue != value && !oldValue.includes(value)))
        ) {
          acc.push(target);
        }
      }
    });
    return acc;
  }

  function _addNodeReducer(acc, cur) {
    const { addedNodes } = cur;
    addedNodes.forEach(addedNode => {
      if (_isCSSSelector(searchTerm)) {
        if (addedNode.nodeType === 1) {
          if (
            find(addedNode, searchTerm) &&
            find(addedNode, searchTerm).length &&
            find(addedNode, searchTerm).length > 0
          ) {
            find(addedNode, searchTerm).forEach(node => {
              acc.push(node);
            });
          } else if (matches(addedNode, searchTerm)) {
            acc.push(addedNode);
          }
        }

        if (addedNode.nodeType === 3) {
          if (
            addedNode.parentNode &&
            matches(addedNode.parentNode, searchTerm)
          ) {
            acc.push(addedNode.parentNode);
          }
        }
      }
      if (_isRegularExpression(searchTerm)) {
        if (addedNode.nodeType === 3) {
          if (searchTerm.test(addedNode.textContent)) {
            acc.push(addedNode.parentNode);
          }
        }
        if (addedNode.nodeType === 1) {
          if (searchTerm.test(addedNode.innerHTML)) {
            acc.push(addedNode);
          }
        }
      }
    });
    return acc;
  }

  function _removeAttributeReducer(acc, cur) {
    const { target, attributeName, oldValue } = cur;
    Array.from(searchTerm.entries()).forEach(nameValuePair => {
      const [name, value] = nameValuePair;
      if (attributeName === name) {
        const currentValue = target[name === "class" ? "className" : name];
        if (
          (oldValue === value || oldValue.includes(value)) &&
          currentValue !== value &&
          !currentValue.includes(value)
        ) {
          acc.push(target);
        }
      }
    });
    return acc;
  }

  function _removeNodeReducer(acc, cur) {
    const { removedNodes, target } = cur;
    removedNodes.forEach(removedNode => {
      if (_isCSSSelector(searchTerm)) {
        if (removedNode.nodeType === 1) {
          if (
            find(removedNode, searchTerm) ||
            matches(removedNode, searchTerm)
          ) {
            acc.push(target);
          }
        }
      }
      if (_isRegularExpression(searchTerm)) {
        if (removedNode.nodeType === 3) {
          if (searchTerm.test(removedNode.textContent)) {
            acc.push(target);
          }
        }
        if (removedNode.nodeType === 1) {
          if (searchTerm.test(removedNode.innerHTML)) {
            acc.push(target);
          }
        }
      }
    });
    return acc;
  }

  function _addCharacterDataReducer(acc, cur) {
    const { target, oldValue } = cur;
    const currentValue = target.textContent;
    if (searchTerm.test(currentValue) && !searchTerm.test(oldValue)) {
      acc.push(target.parentNode);
    }
    return acc;
  }

  function _removeChracterDataReducer(acc, cur, idx, src) {
    const { target, oldValue } = cur;
    const currentValue = target.textContent;
    if (searchTerm.test(oldValue) && !searchTerm.test(currentValue)) {
      acc.push(target.parentNode);
    }
    return acc;
  }
};

function _isCSSSelector(term) {
  if (typeof term !== "string") {
    return false;
  }
  try {
    document.querySelector(term);
    return true;
  } catch (error) {
    return false;
  }
}

function _isRegularExpression(term) {
  return term instanceof RegExp;
}

function _isAttributeMap(term) {
  return (
    term instanceof Map &&
    Array.from(term.keys()).every(n => typeof n === "string") &&
    Array.from(term.values()).every(n => typeof n === "string")
  );
}

async function _observeNode(elem, term, addOrRemove) {
  const nodes = await _observeDom(elem, 1, term, addOrRemove);
  return nodes;
}

async function _observeAttribute(elem, term, addOrRemove) {
  const nodes = await _observeDom(elem, 2, term, addOrRemove);
  return nodes;
}

async function _observeText(elem, term, addOrRemove) {
  const nodes = await _observeDom(elem, 3, term, addOrRemove);
  return nodes;
}

const onceFunctionTemplate = function onceFunctionTemplate(
  observeFunction,
  observeType
) {
  const functionName = `once${observeFunction.name.replace("_observe", "") +
    (observeType === 1 ? "Added" : "Removed")}`;
  const f = async function(elem, term) {
    const nodes = await observeFunction(elem, term, observeType);
    return Promise.resolve(nodes);
  };
  Object.defineProperty(f, "name", { value: functionName, configurable: true });
  return f;
};

const onFunctionTemplate = function onFunctionTemplate(onceFunction) {
  const functionName = onceFunction.name.replace("once", "on");
  const f = function(elem, term, callback, times = Number.MAX_SAFE_INTEGER) {
    onceFunction(elem, term).then(function handleNodes(nodes) {
      callback(nodes);
      if (--times > 0) {
        onceFunction(elem, term).then(handleNodes);
      }
    });
  };
  Object.defineProperty(f, "name", { value: functionName, configurable: true });
  return f;
};

const onceTextAdded = onceFunctionTemplate(_observeText, ADD);
const onTextAdded = onFunctionTemplate(onceTextAdded);
const onceTextRemoved = onceFunctionTemplate(_observeText, REMOVE);
const onTextRemoved = onFunctionTemplate(onceTextRemoved);
const onceNodeAdded = onceFunctionTemplate(_observeNode, ADD);
const onNodeAdded = onFunctionTemplate(onceNodeAdded);
const onceNodeRemoved = onceFunctionTemplate(_observeNode, REMOVE);
const onNodeRemoved = onFunctionTemplate(onceNodeRemoved);
const onceAttributeAdded = onceFunctionTemplate(_observeAttribute, ADD);
const onAttributeAdded = onFunctionTemplate(onceAttributeAdded);
const onceAttributeRemoved = onceFunctionTemplate(_observeAttribute, REMOVE);
const onAttributeRemoved = onFunctionTemplate(onceAttributeRemoved);

module.exports = {
  onceTextAdded,
  onceAttributeAdded,
  onceNodeAdded,
  onceNodeRemoved,
  onceAttributeRemoved,
  onceTextRemoved,
  onAttributeAdded,
  onAttributeRemoved,
  onNodeAdded,
  onNodeRemoved,
  onTextAdded,
  onTextRemoved
};
