import { onNodeAdded } from "../DOMObserver";
import ShopifyAPI from "../ShopifyAPI";
import { createFragmentFromString } from "../Helpers/Utilities";
import axios from "axios";
const { getCart } = ShopifyAPI;
export default {
  loadGridItems(
    placeHolderSelector,
    templateSuffix,
    section_settings,
    callback
  ) {
    onNodeAdded(
      document.documentElement,
      placeHolderSelector,
      function fillProductContent(productPlaceHolders) {
        let remained = productPlaceHolders.length;
        productPlaceHolders.forEach(function(productPlaceHolder) {
          const { handle } = productPlaceHolder.dataset;
          const url = `https://${location.host}/products/${handle}?view=${templateSuffix}`;
          axios.get(url).then(function(htmlString) {
            --remained;
            if (
              section_settings &&
              Object.keys(section_settings) &&
              Object.keys(section_settings).length > 0
            ) {
              Object.keys(section_settings).forEach(function(key) {
                var regExp = new RegExp("{section_settings_" + key + "}", "g");
                htmlString = htmlString.replace(regExp, section_settings[key]);
              });
            }

            htmlString.replace(new RegExp("remove_false_", "g"), "");
            htmlString.replace(new RegExp("add_true_", "g"), "");

            var productElement = createFragmentFromString(htmlString);

            if (htmlString.indexOf("bold_not_available") > -1) {
              productPlaceHolder.parentNode.removeChild(productPlaceHolder);
            } else {
              productPlaceHolder.parentNode.replaceChild(
                productElement,
                productPlaceHolder
              );
            }
            typeof callback === "function" && callback(remained);
          });
        });
      }
    );
  },
  cspHandleCart(cart) {
    return new Promise(function(resolve, reject) {
      try {
        if (typeof window.shappify_qb_got_cart === "function") {
          if (cart && cart.token) {
            window.shappify_csp_got_cart(cart, resolve);
          } else {
            getCart().then(function(cart) {
              window.shappify_csp_got_cart(cart, resolve);
            });
          }
        } else {
          if (cart && cart.token) {
            resolve(cart);
          } else {
            getCart().then(resolve);
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }
};
