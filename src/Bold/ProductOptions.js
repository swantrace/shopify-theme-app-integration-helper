/* eslint-disable no-console */
import axios from "axios";
import { range, isValidATCForm } from "../Helpers/ShopifyGeneralHelpers";
import { empty, remove, removeClass } from "../Helpers/DomHelpers";
import { createFragmentFromString } from "../Helpers/Utilities";
import { onNodeAdded } from "../DOMObserver";

export default {
  getOptionsByProductId(productId, shopifyURL) {
    const tmp = new Date().getTime();
    return axios
      .get(
        `https://option.boldapps.net/v2/${shopifyURL}/generate_option/${productId}?tmp=${tmp}`
      )
      .then(
        ({ data }) =>
          (data.option_product && data.option_product.option_sets) || []
      );
  },
  hasOption(productId, shopifyURL) {
    const self = this;
    return new Promise(function(resolve, reject) {
      self
        .getOptionsByProductId(productId, shopifyURL)
        .then(option_sets => {
          if (option_sets.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(reject);
    });
  },
  quickATCButtonToLink(
    shopifyURL,
    itemGridSelector,
    addToCartButtonSelector,
    buttonText,
    buttonTextElementSelector
  ) {
    const self = this;
    document.addEventListener(
      "click",
      function(event) {
        let target = event.target;
        if (target.closest("[data-x-should-redirect][data-x-redirect-url]")) {
          event.preventDefault();
          event.stopImmediatePropagation();
          event.stopPropagation();
          let url = target.closest(
            "[data-x-should-redirect][data-x-redirect-url]"
          ).dataset.xRedirectUrl;
          location.href = url;
        }
      },
      true
    );
    onNodeAdded(document.documentElement, addToCartButtonSelector, buttons => {
      buttons.forEach(button => {
        const itemGrid = button.closest(itemGridSelector);
        const productUrl = itemGrid.dataset.productUrl;
        const productId = itemGrid.dataset.productId;
        let buttonTextElement;
        if (!buttonTextElementSelector) {
          buttonTextElement = button;
        } else {
          buttonTextElement = button.querySelector(buttonTextElementSelector);
        }
        self.hasOption(productId, shopifyURL).then(function(productHasOptions) {
          if (productHasOptions) {
            buttonTextElement.firstChild.textContent = buttonText;
            button.dataset.xRedirectUrl = productUrl;
            button.dataset.xShouldRedirect = true;
          }
        });
      });
    });
  },
  removeClonedButtonAndResumeOriginalButton(
    form,
    buttonSelector = "[type='submit'][name='add']"
  ) {
    const clonedButton =
      form && form.querySelector(`.bold_clone${buttonSelector}`);
    const hiddenButton =
      form && form.querySelector(`.bold_hidden${buttonSelector}`);
    clonedButton && clonedButton.remove();
    hiddenButton && removeClass(hiddenButton, "bold_hidden");
    hiddenButton &&
      hiddenButton.style.display === "none" &&
      hiddenButton.style.removeProperty("display");
  },
  deleteOptionProductByProductId(productId) {
    if (
      window.BOLD &&
      window.BOLD.options &&
      window.BOLD.options.app &&
      window.BOLD.options.app.optionProducts
    ) {
      window.BOLD.options.app.optionProducts = window.BOLD.options.app.optionProducts.filter(
        optionProduct => optionProduct.productId != productId
      );
    }
  },
  unloadOptionsOfForm(
    form,
    productId,
    referenceNode = form.firstChild,
    moveIfExist = false,
    atcButtonSelector = "[type='submit'][name='add']"
  ) {
    if (!(window.BOLD && window.BOLD.options && window.BOLD.options.app)) {
      console.log("The store doesn't have PO installed");
      return false;
    }
    const optionWidgets = Array.from(
      form.getElementsByClassName("bold_options")
    );
    if (isValidATCForm(form)) {
      if (optionWidgets.length >= 1) {
        range(1, optionWidgets.length).forEach(i => {
          remove(optionWidgets[i]);
        });
        empty(optionWidgets[0]);
        removeClass(optionWidgets[0], "bold_options_loaded");
        optionWidgets[0].setAttribute("data-product-id", productId);
        moveIfExist && form.insertBefore(optionWidgets[0], referenceNode);
      } else {
        form.insertBefore(
          createFragmentFromString(
            `<div class="bold_options" data-product-id="${productId}"></div>`
          ),
          referenceNode
        );
      }
    } else {
      console.log(
        "The form passed is not a valid add-to-cart form, remove all the div.bold_options children if the form has any"
      );
      optionWidgets.forEach(optionWidget => {
        remove(optionWidget);
      });
    }
    this.removeClonedButtonAndResumeOriginalButton(form, atcButtonSelector);
    this.deleteOptionProductByProductId(productId);
    return true;
  },
  reloadOptionsOfForm(
    form,
    productId,
    referenceNode = form.firstChild,
    moveIfExist = false,
    atcButtonSelector = "[type='submit'][name='add']"
  ) {
    this.unloadOptionsOfForm(
      form,
      productId,
      referenceNode,
      moveIfExist,
      atcButtonSelector
    );
    if (
      window.BOLD &&
      window.BOLD.options &&
      window.BOLD.options.app &&
      typeof window.BOLD.options.app.boot == "function"
    ) {
      window.BOLD.options.app.boot();
    }
  }
};
