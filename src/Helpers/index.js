function throwIfMissing(name) {
  throw new Error(`Missing a ${name} as the parameter`);
}

function fragmentFromString(str) {
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

module.exports = {
  throwIfMissing,
  fragmentFromString,
  throttle
};
