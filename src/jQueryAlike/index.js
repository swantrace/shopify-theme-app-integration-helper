const siblings = function () {
    return Array.from(this.parentNode.children).filter(function (child) {
        return child !== this.element;
    })
}

const prev = function () {
    return this.previousElementSibling;
}

const next = function () {
    return this.nextElementSibling;
}

const prevAll = function (filter) {
    let sibs = [];
    let elem = this.element;
    while (elem = elem.previousSibling) {
        if (elem.nodeType === 3) continue;
        if (!filter || filter(elem)) sibs.push(elem);
    }
    return sibs;
}

module.exports = {
    siblings,
    prev,
    next,
    prevAll
}