import { onNodeAdded } from "../DOMObserver";
import axios from "axios";
import { createFragmentFromString } from "../Helpers/Utilities";
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
  }
};
