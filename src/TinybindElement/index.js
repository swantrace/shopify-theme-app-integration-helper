const tinybind = require('tinybind');

tinybind.configure({
    binders: {
        'prop-*': function (el, value) {
            console.log(this.arg, value)
            el[this.arg] = value;
        }
    }
})

class TinybindElement extends HTMLElement {
    connectedCallback() {
        const template = this.constructor.template
        const templateEl = document.createElement('template')
        templateEl.innerHTML = template
        const clonedTemplate = templateEl.content.cloneNode(true)
        this.__tinybindView = tinybind.bind(clonedTemplate, this)
        this.appendChild(clonedTemplate)
    }

    disconnectedCallback() {
        this.__tinybindView.unbind()
    }
}

function define(tagName, template, data) {
    customElements.define(tagName, class extends TinybindElement {
        constructor() {
            super();
            this.data = data;
        }
        static get template() {
            return template;
        }
    })
}

function bindData(elem, data) {
    return tinybind.bind(elem, data);
}

module.exports = {
    define,
    bindData
};