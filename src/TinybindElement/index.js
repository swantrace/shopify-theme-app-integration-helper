const tinybind = require("tinybind");
const { formatMoney } = require("../Helpers/ShopifyGeneralHelpers");

tinybind.formatters["="] = (value, arg) => value == arg;

tinybind.formatters[">"] = (value, arg) => value > arg;

tinybind.formatters[">="] = (value, arg) => value >= arg;

tinybind.formatters["<"] = (value, arg) => value < arg;

tinybind.formatters["<="] = (value, arg) => value <= arg;

tinybind.formatters.money = (value, format = "${{amount}}") =>
  formatMoney(value, format);

tinybind.formatters["+"] = (value, arg) => value + arg;
tinybind.formatters["-"] = (value, arg) => value - arg;
tinybind.formatters["*"] = (value, arg) => value * arg;
tinybind.formatters["/"] = (value, arg) => value / arg;

function define(tagName, template, properties) {
  customElements.define(
    tagName,
    class extends tinybind.Component {
      static get properties() {
        return properties;
      }
      static get template() {
        return template;
      }
    }
  );
}

function bindData(elem, data) {
  return tinybind.bind(elem, data);
}

export default {
  define,
  bindData
};
