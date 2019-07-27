/* eslint-disable no-console */
import { Promise } from "bluebird";
import axios from "axios";
import isEqual from "lodash.isequal";

export default {
  range(start, stop, step = 1) {
    return Array(Math.ceil((stop - start) / step))
      .fill(start)
      .map((x, y) => x + y * step);
  },
  sendRequestsInParallel(requestObjects, limit = Infinity, callback = a => a) {
    return Promise.map(
      requestObjects,
      ({ url, method, data }) => {
        if (method === "get") {
          return axios.get(url).then(callback);
        }
        if (method === "post") {
          return axios.post(url, data).then(callback);
        }
      },
      { cocurrency: limit }
    );
  },
  sendRequestsInSeries(requestObjects, callback = a => a) {
    return Promise.mapSeries(requestObjects, ({ url, method, data }) => {
      if (method === "get") {
        return axios.get(url).then(callback);
      }
      if (method === "post") {
        return axios.post(url, data).then(callback);
      }
    });
  },
  throwIfMissing(name) {
    throw new Error(`Missing a ${name} as the parameter`);
  },
  fragmentFromString(str) {
    return document.createRange().createContextualFragment(str);
  },
  throttle(fn, interval) {
    let timer,
      firstTime = true;
    return function(...args) {
      let self = this;
      if (firstTime) {
        let result = fn.apply(self, args);
        firstTime = false;
        return result;
      }
      if (timer) {
        return false;
      }
      timer = setTimeout(function() {
        clearTimeout(timer);
        timer = null;
        fn.apply(self, args);
      }, interval || 500);
    };
  },
  formatMoney(money, format) {
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
        window.BOLD.common.Shopify.shop.money_format ||
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
  },
  addcss(css) {
    var head = document.getElementsByTagName("head")[0];
    var s = document.createElement("style");
    s.setAttribute("type", "text/css");
    if (s.styleSheet) {
      // IE
      s.styleSheet.cssText = css;
    } else {
      // the world
      s.appendChild(document.createTextNode(css));
    }
    head.appendChild(s);
    return s;
  },
  hideCheckoutButtons(form, selectors = []) {
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
  },
  showCheckoutButtonsHiddenByUs(form, selectors = []) {
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
  },
  quantityInputValuesInAgreementWithCartObject(form, cart) {
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
  },
  toggleFocusInFocusOutEventListenersOfElement(
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
  },
  toggleCheckout(form, cart, selectors) {
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
            this.quantityInputValuesInAgreementWithCartObject(form, cart) ===
            true
          ) {
            this.showCheckoutButtonsHiddenByUs(form, selectors);
          }
        }
      );
    });
  },
  isValidATCForm(form) {
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

    const submitButton = form.querySelector("[type='submit'][name='add']");
    if (submitButton === null) {
      console.log("the form doesn't have a submit button");
      return false;
    }

    return true;
  }
};
