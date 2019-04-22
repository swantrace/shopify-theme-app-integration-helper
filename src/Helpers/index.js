function throwIfMissing(name) {
    throw new Error(`Missing a ${name} as the parameter`);
}

module.exports = {
    throwIfMissing
}