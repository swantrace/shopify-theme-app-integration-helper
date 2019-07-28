import axios from "axios";
import { Promise } from "bluebird";
const htmlTags = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "math",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rb",
  "rp",
  "rt",
  "rtc",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "slot",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr"
];
const htmlAttributes = [
  "abbr",
  "accept",
  "accept-charset",
  "accesskey",
  "action",
  "allowfullscreen",
  "allowtransparency",
  "alt",
  "async",
  "autocomplete",
  "autofocus",
  "autoplay",
  "cellpadding",
  "cellspacing",
  "challenge",
  "charset",
  "checked",
  "cite",
  "class",
  "cols",
  "colspan",
  "command",
  "content",
  "contenteditable",
  "contextmenu",
  "controls",
  "coords",
  "crossorigin",
  "data",
  "datetime",
  "default",
  "defer",
  "dir",
  "disabled",
  "download",
  "draggable",
  "dropzone",
  "enctype",
  "for",
  "form",
  "formaction",
  "formenctype",
  "formmethod",
  "formnovalidate",
  "formtarget",
  "frameBorder",
  "headers",
  "height",
  "hidden",
  "high",
  "href",
  "hreflang",
  "http-equiv",
  "icon",
  "id",
  "inputmode",
  "ismap",
  "itemid",
  "itemprop",
  "itemref",
  "itemscope",
  "itemtype",
  "kind",
  "label",
  "lang",
  "list",
  "loop",
  "manifest",
  "max",
  "maxlength",
  "media",
  "mediagroup",
  "method",
  "min",
  "minlength",
  "multiple",
  "muted",
  "name",
  "novalidate",
  "open",
  "optimum",
  "pattern",
  "ping",
  "placeholder",
  "poster",
  "preload",
  "radiogroup",
  "readonly",
  "rel",
  "required",
  "role",
  "rows",
  "rowspan",
  "sandbox",
  "scope",
  "scoped",
  "scrolling",
  "seamless",
  "selected",
  "shape",
  "size",
  "sizes",
  "sortable",
  "span",
  "spellcheck",
  "src",
  "srcdoc",
  "srcset",
  "start",
  "step",
  "style",
  "tabindex",
  "target",
  "title",
  "translate",
  "type",
  "typemustmatch",
  "usemap",
  "value",
  "width",
  "wmode",
  "wrap",
  "onabort",
  "onautocomplete",
  "onautocompleteerror",
  "onblur",
  "oncancel",
  "oncanplay",
  "oncanplaythrough",
  "onchange",
  "onclick",
  "onclose",
  "oncontextmenu",
  "oncuechange",
  "ondblclick",
  "ondrag",
  "ondragend",
  "ondragenter",
  "ondragexit",
  "ondragleave",
  "ondragover",
  "ondragstart",
  "ondrop",
  "ondurationchange",
  "onemptied",
  "onended",
  "onerror",
  "onfocus",
  "oninput",
  "oninvalid",
  "onkeydown",
  "onkeypress",
  "onkeyup",
  "onload",
  "onloadeddata",
  "onloadedmetadata",
  "onloadstart",
  "onmousedown",
  "onmouseenter",
  "onmouseleave",
  "onmousemove",
  "onmouseout",
  "onmouseover",
  "onmouseup",
  "onmousewheel",
  "onpause",
  "onplay",
  "onplaying",
  "onprogress",
  "onratechange",
  "onreset",
  "onresize",
  "onscroll",
  "onseeked",
  "onseeking",
  "onselect",
  "onshow",
  "onsort",
  "onstalled",
  "onsubmit",
  "onsuspend",
  "ontimeupdate",
  "ontoggle",
  "onvolumechange",
  "onwaiting"
];
function isHTML(string) {
  const basic = /\s?<!doctype html>|(<html\b[^>]*>|<body\b[^>]*>|<x-[^>]+>)+/i;
  const full = new RegExp(
    htmlTags.map(tag => `<${tag}\\b[^>]*>`).join("|"),
    "i"
  );
  return basic.test(string) || full.test(string);
}

function isCSSSelector(string) {
  if (typeof string !== "string") {
    return false;
  }
  try {
    document.querySelector(string);
    return true;
  } catch (error) {
    return false;
  }
}

function isRegularExpression(term) {
  return term instanceof RegExp;
}

function isAttributeMap(term) {
  return (
    term instanceof Map &&
    Array.from(term.keys()).every(
      n =>
        typeof n === "string" &&
        (htmlAttributes.includes(n) || /^data-/.test(n))
    ) &&
    Array.from(term.values()).every(n => typeof n === "string")
  );
}

function isNode(o) {
  return typeof Node === "object"
    ? o instanceof Node
    : o &&
        typeof o === "object" &&
        typeof o.nodeType === "number" &&
        typeof o.nodeName === "string";
}

function range(start, stop, step = 1) {
  return Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);
}

function sendRequestsInParallel(
  requestObjects,
  limit = Infinity,
  callback = a => a
) {
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
}

function sendRequestsInSeries(requestObjects, callback = a => a) {
  return Promise.mapSeries(requestObjects, ({ url, method, data }) => {
    if (method === "get") {
      return axios.get(url).then(callback);
    }
    if (method === "post") {
      return axios.post(url, data).then(callback);
    }
  });
}

function throwIfMissing(name) {
  throw new Error(`Missing a ${name} as the parameter`);
}

function createFragmentFromString(str) {
  return document.createRange().createContextualFragment(str);
}

function throttle(fn, interval) {
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
}
function merge(...arrs) {
  return Array.from(new Set([].concat(...arrs)));
}

export {
  isHTML,
  isCSSSelector,
  isRegularExpression,
  isAttributeMap,
  isNode,
  range,
  sendRequestsInParallel,
  sendRequestsInSeries,
  throwIfMissing,
  createFragmentFromString,
  throttle,
  merge
};
