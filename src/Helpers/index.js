function throwIfMissing(name) {
    throw new Error(`Missing a ${name} as the parameter`);
}

function fragmentFromString(str) {
    return document.createRange().createContextualFragment(str);
}

module.exports = {
    throwIfMissing,
    fragmentFromString
}