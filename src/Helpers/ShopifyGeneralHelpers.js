/* eslint-disable no-console */
import isEqual from "lodash.isequal";
import elementResizeDetectorMaker from "element-resize-detector";
import { onNodeAdded } from "../DOMObserver/index";

function formatMoney(money, format) {
  function n(t, e) {
    return "undefined" == typeof t ? e : t;
  }
  function r(t, e, r, i) {
    if (
      ((e = n(e, 2)), (r = n(r, ",")), (i = n(i, ".")), isNaN(t) || null == t)
    )
      return 0;
    t = (t / 100).toFixed(e);
    var o = t.split("."),
      a = o[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + r),
      s = o[1] ? i + o[1] : "";
    return a + s;
  }
  "string" == typeof money && (money = money.replace(".", ""));
  var i = "",
    o = /\{\{\s*(\w+)\s*\}\}/,
    a =
      format ||
      window.Shopify.money_format ||
      "$ {% raw %}{{ amount }}{% endraw %}";
  switch (a.match(o)[1]) {
    case "amount":
      i = r(money, 2, ",", ".");
      break;
    case "amount_no_decimals":
      i = r(money, 0, ",", ".");
      break;
    case "amount_with_comma_separator":
      i = r(money, 2, ".", ",");
      break;
    case "amount_no_decimals_with_comma_separator":
      i = r(money, 0, ".", ",");
      break;
    case "amount_with_space_separator":
      i = r(money, 2, " ", ",");
      break;
    case "amount_no_decimals_with_space_separator":
      i = r(money, 0, " ", ",");
      break;
    case "amount_with_apostrophe_separator":
      i = r(money, 2, "'", ".");
      break;
  }
  return a.replace(o, i);
}

function hideCheckoutButtons(form, selectors = []) {
  var allSelectors = [
    '[name="checkout"]',
    ".additional-checkout-button",
    ".additional-checkout-buttons",
    'a[href*="https://partial.ly/checkout"]',
    ...selectors
  ];
  form.querySelectorAll(allSelectors.join(",")).forEach(function(button) {
    var currentDisplayValue = window
      .getComputedStyle(button)
      .getPropertyValue("display");
    button.setAttribute("data-x-original-display-value", currentDisplayValue);
    button.style.setProperty("display", "none", "important");
  });
}

function showCheckoutButtonsHiddenByUs(form, selectors = []) {
  var allSelectors = [
    '[name="checkout"]',
    ".additional-checkout-button",
    ".additional-checkout-buttons",
    'a[href*="https://partial.ly/checkout"]',
    ...selectors
  ];
  form.querySelectorAll(allSelectors.join(",")).forEach(function(button) {
    var currentDisplayValue = window
      .getComputedStyle(button)
      .getPropertyValue("display");
    if (currentDisplayValue === "none") {
      if (button.getAttribute("data-x-original-display-value")) {
        button.style.setProperty(
          "display",
          button.getAttribute("data-x-original-display-value")
        );
        button.removeAttribute("data-x-original-display-value");
      }
    }
  });
}

function quantityInputValuesInAgreementWithCartObject(form, cart) {
  if (cart && cart.token) {
    const numberOfLinesInCartObject = cart.items.length;
    const quantitiesInCartObject = cart.items.map(item => item.quantity);
    if (
      form &&
      form.action &&
      (form.action.includes("/cart") || form.action.includes("/checkout")) &&
      form.querySelectorAll("[name='updates[]']") &&
      form.querySelectorAll("[name='updates[]']").length &&
      form.querySelectorAll("[name='updates[]']").length ===
        numberOfLinesInCartObject
    ) {
      const quantitiesInDOM = Array.from(
        form.querySelectorAll("[name='updates[]']")
      ).map(input => parseInt(input.value));
      if (isEqual(quantitiesInCartObject, quantitiesInDOM)) {
        return true;
      }
    }
  }
  return false;
}

function toggleFocusInFocusOutEventListenersOfElement(
  elem,
  whatToDoAfterFocusIn,
  whatToDoAfterFocusOut
) {
  let focusInEventListener, focusOutEventListener;
  focusOutEventListener = function focusOutEventListener(e) {
    e.target.removeEventListener("focusout", focusOutEventListener);
    whatToDoAfterFocusOut();
    e.target.addEventListener("focusin", focusInEventListener);
  };
  focusInEventListener = function focusInEventListener(e) {
    e.target.removeEventListener("focusin", focusInEventListener);
    whatToDoAfterFocusIn();
    e.target.addEventListener("focusout", focusOutEventListener);
  };
  elem.blur();
  elem.addEventListener("focusin", focusInEventListener);
}

function toggleCheckout(form, cart, selectors) {
  const quantityInputs = Array.from(
    form.querySelectorAll("[name='updates[]']")
  );
  quantityInputs.forEach(input => {
    this.toggleFocusInFocusOutEventListenersOfElement(
      input,
      function() {
        this.hideCheckoutButtons(form, selectors);
      },
      function() {
        if (
          this.quantityInputValuesInAgreementWithCartObject(form, cart) === true
        ) {
          this.showCheckoutButtonsHiddenByUs(form, selectors);
        }
      }
    );
  });
}

function isValidATCForm(form) {
  if (!form) {
    console.log("there is no form being passed");
    return false;
  }
  const actionText = form.getAttribute("action");
  if (
    typeof actionText !== "string" ||
    actionText.toLowerCase() !== "/cart/add"
  ) {
    console.log(
      "cannot find action attribute or the value of that attribute is not '/cart/add'"
    );
    return false;
  }
  const nameIDInputsOrSelects = form.querySelectorAll(
    "select[name='id'], input[name='id'], select[name='id[]'], input[name='id[]']"
  );
  if (nameIDInputsOrSelects.length === 0) {
    console.log("there is no [name='id'] input or select within the form");
    return false;
  }
  if (!/\d+/.test(nameIDInputsOrSelects[0].value)) {
    console.log(
      "the value of [name='id'] input or select is not a string of numbers"
    );
    return false;
  }

  const submitButton = form.querySelector(
    "[type='submit'][name='add'],[type='button'][name='add']"
  );
  if (submitButton === null) {
    console.log("the form doesn't have a submit button");
    return false;
  }

  return true;
}

function addCSS(text) {
  var head = document.getElementsByTagName("head")[0];
  var s = document.createElement("style");
  s.setAttribute("type", "text/css");
  s.appendChild(document.createTextNode(text));
  head.appendChild(s);
  return s;
}

function addJS(text) {
  var head = document.getElementsByTagName("head")[0];
  var s = document.createElement("script");
  s.setAttribute("type", "text/javascript");
  s.appendChild(document.createTextNode(text));
  head.appendChild(s);
  return s;
}

function blockScripts(list) {
  document.createElement = (function() {
    var cached_function = document.createElement;
    return function() {
      if (arguments[0].toLowerCase() !== "script") {
        return cached_function.apply(this, arguments);
      }
      var scriptElt = cached_function.apply(this, arguments);
      var originalDescriptors = {
        src: Object.getOwnPropertyDescriptor(
          HTMLScriptElement.prototype,
          "src"
        ),
        type: Object.getOwnPropertyDescriptor(
          HTMLScriptElement.prototype,
          "type"
        )
      };
      Object.defineProperties(scriptElt, {
        src: {
          set(value) {
            // If we set the source to a blacklisted url, we enforce the right type.
            if (isInBlacklist(value)) {
              scriptElt.type = "javascript/blocked";
            }
            return originalDescriptors.src.set.call(this, value);
          },
          get() {
            return originalDescriptors.src.get.call(this);
          }
        },
        type: {
          set(value) {
            return originalDescriptors.type.set.call(
              this,
              isInBlacklist(scriptElt.src) ? "javascript/blocked" : value
            );
          },
          get() {
            return originalDescriptors.type.get.call(this);
          }
        }
      });
      scriptElt.setAttribute = function(name, value) {
        if (name === "type" || name === "src") {
          scriptElt[name] = value;
        } else {
          HTMLScriptElement.prototype.setAttribute.call(scriptElt, name, value);
        }
      };
      return scriptElt;
    };
  })();

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1 && node.tagName === "SCRIPT") {
          var src = node.src || "";
          if (isInBlacklist(src)) {
            node.type = "javascript/blocked";
          }
        }
      });
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  function isInBlacklist(src) {
    if (
      list.includes(src) ||
      list.filter(function(str) {
        return src.includes(str);
      }).length > 0
    ) {
      return true;
    }
    return false;
  }
}

function affirmUpdatePrice() {
  if (
    window.affirm &&
    window.affirm.ui &&
    typeof window.affirm.ui.refresh === "function"
  ) {
    window.affirm.ui.refresh();
  } else {
    console.log("There is no affirm.ui.refresh function");
  }
}

function onScriptsLoaded(list, cb) {
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1 && node.tagName === "SCRIPT") {
          var src = node.src || "";
          if (isInConcernedlist(src)) {
            node.onload = cb;
          }
        }
      });
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  function isInConcernedlist(src) {
    if (
      list.includes(src) ||
      list.filter(function(str) {
        return src.includes(str);
      }).length > 0
    ) {
      return true;
    }
    return false;
  }
}

function onATCFormResize(cb, filter) {
  const erd = elementResizeDetectorMaker();
  onNodeAdded(document.documentElement, 'form[action="/cart/add"]', forms => {
    forms.forEach(form => {
      erd.listenTo(form, form => {
        if (!filter || filter(form)) {
          cb(form);
        }
      });
    });
  });
}

export {
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
  onATCFormResize
};
