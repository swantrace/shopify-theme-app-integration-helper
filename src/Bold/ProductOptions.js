/* eslint-disable no-console */
import axios from "axios";
import {
  range,
  fragmentFromString,
  isValidATCForm
} from "../Helpers/ShopifyGeneralHelpers";
import { empty, remove } from "../Helpers/DomHelpers";

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
  removeClonedButtonAndResumeOriginalButton(
    form,
    buttonSelector = "[type='submit'][name='add']"
  ) {
    const clonedButton =
      form && form.querySelector(`.bold_clone${buttonSelector}`);
    const hiddenButton =
      form && form.querySelector(`.bold_hidden${buttonSelector}`);
    clonedButton && clonedButton.remove();
    hiddenButton && hiddenButton.removeClass("bold_hidden");
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
        ({ currentProductId }) => currentProductId != productId
      );
    }
  },
  unloadOptionsOfForm(
    form,
    productId,
    referenceNode = form.firstChild,
    atcButtonSelector = "[type='submit'][name='add']"
  ) {
    if (!(window.BOLD && window.BOLD.options && window.BOLD.options.app)) {
      console.log("The store doesn't have PO installed");
      return false;
    }
    const optionWidgets = Array.from(
      form.getElmentsByClassName("bold_options")
    );
    if (isValidATCForm(form)) {
      if (optionWidgets.length >= 1) {
        range(1, optionWidgets.length).forEach(i => {
          remove(optionWidgets[i]);
        });
        empty(optionWidgets[0]);
        optionWidgets[0].removeClass("bold_options_loaded");
        optionWidgets[0].setAttribute("data-product-id", productId);
        form.insertBefore(optionWidgets[0], referenceNode);
      } else {
        form.insertBefore(
          fragmentFromString(
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
  }
};
