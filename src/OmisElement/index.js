import { define as omisDefine, h } from "omis";
import htm from "htm";
const defaultStoreFns = {
  install() {
    console.log("install");
  },
  installed() {
    console.log("installed");
  },
  uninstall() {
    console.log("uninstall");
  },
  beforeUpdate() {
    console.log("beforeUpdate");
  },
  updated() {
    console.log("updated");
  },
  beforeRender() {
    console.log("beforeRender");
  },
  receiveProps() {
    console.log("receiveProps");
  }
};
export const html = htm.bind(h);
export function define(
  tagName,
  fn,
  cssString = "",
  storeObjectFactoryFn = () => {},
  propTypesObject = {}
) {
  const CurrentComponent = fn;
  CurrentComponent.css = cssString;
  CurrentComponent.store = _ => ({
    ...defaultStoreFns,
    ...storeObjectFactoryFn(_)
  });
  if (
    typeof propTypesObject === "object" &&
    Object.keys(propTypesObject).length > 0
  ) {
    CurrentComponent.propTypes = propTypesObject;
  }
  omisDefine(tagName, CurrentComponent);
}
