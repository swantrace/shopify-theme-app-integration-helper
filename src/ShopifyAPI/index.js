import axios from "axios";

export default {
  getCart({
    baseURL = undefined,
    requestInterceptor = function requestInterceptor(config) {
      return config;
    },
    requestInterceptorError = function requestInterceptorError(error) {
      return Promise.reject(error);
    },
    responseInterceptor = function responseInterceptor(response) {
      return response.data;
    },
    responseInterceptorError = function responseInterceptorError(error) {
      return Promise.reject(error);
    }
  } = {}) {
    let instance;
    if (typeof baseURL === "string") {
      instance = axios.create({ baseURL });
    } else {
      instance = axios.create();
    }
    instance.interceptors.request.use(
      requestInterceptor,
      requestInterceptorError
    );
    instance.interceptors.response.use(
      responseInterceptor,
      responseInterceptorError
    );
    return instance.get("/cart.js");
  },
  getProduct(
    handle,
    {
      baseURL = undefined,
      requestInterceptor = function requestInterceptor(config) {
        return config;
      },
      requestInterceptorError = function requestInterceptorError(error) {
        return Promise.reject(error);
      },
      responseInterceptor = function responseInterceptor(response) {
        return response.data;
      },
      responseInterceptorError = function responseInterceptorError(error) {
        return Promise.reject(error);
      }
    } = {}
  ) {
    let instance;
    if (typeof baseURL === "string") {
      instance = axios.create({ baseURL });
    } else {
      instance = axios.create();
    }
    instance.interceptors.request.use(
      requestInterceptor,
      requestInterceptorError
    );
    instance.interceptors.response.use(
      responseInterceptor,
      responseInterceptorError
    );
    return instance.get(`/products/${handle}.js`);
  },
  clearCart({
    baseURL = undefined,
    requestInterceptor = function requestInterceptor(config) {
      return config;
    },
    requestInterceptorError = function requestInterceptorError(error) {
      return Promise.reject(error);
    },
    responseInterceptor = function responseInterceptor(response) {
      return response.data;
    },
    responseInterceptorError = function responseInterceptorError(error) {
      return Promise.reject(error);
    }
  } = {}) {
    let instance;
    if (typeof baseURL === "string") {
      instance = axios.create({ baseURL });
    } else {
      instance = axios.create();
    }
    instance.interceptors.request.use(
      requestInterceptor,
      requestInterceptorError
    );
    instance.interceptors.response.use(
      responseInterceptor,
      responseInterceptorError
    );
    return instance.post("/cart/clear.js");
  },
  updateCartFromForm(
    form,
    {
      baseURL = undefined,
      requestInterceptor = function requestInterceptor(config) {
        return config;
      },
      requestInterceptorError = function requestInterceptorError(error) {
        return Promise.reject(error);
      },
      responseInterceptor = function responseInterceptor(response) {
        return response.data;
      },
      responseInterceptorError = function responseInterceptorError(error) {
        return Promise.reject(error);
      }
    } = {}
  ) {
    let instance;
    if (typeof baseURL === "string") {
      instance = axios.create({ baseURL });
    } else {
      instance = axios.create();
    }
    instance.interceptors.request.use(
      requestInterceptor,
      requestInterceptorError
    );
    instance.interceptors.response.use(
      responseInterceptor,
      responseInterceptorError
    );
    return instance.post("/cart/update.js", new FormData(form));
  },
  changeItemByKey(
    quantity,
    key,
    {
      baseURL = undefined,
      requestInterceptor = function requestInterceptor(config) {
        return config;
      },
      requestInterceptorError = function requestInterceptorError(error) {
        return Promise.reject(error);
      },
      responseInterceptor = function responseInterceptor(response) {
        return response.data;
      },
      responseInterceptorError = function responseInterceptorError(error) {
        return Promise.reject(error);
      }
    } = {}
  ) {
    let instance;
    if (typeof baseURL === "string") {
      instance = axios.create({ baseURL });
    } else {
      instance = axios.create();
    }
    instance.interceptors.request.use(
      requestInterceptor,
      requestInterceptorError
    );
    instance.interceptors.response.use(
      responseInterceptor,
      responseInterceptorError
    );
    return instance.post("/cart/change.js", { quantity: quantity, id: key });
  },
  removeItemByKey(
    key,
    {
      baseURL = undefined,
      requestInterceptor = function requestInterceptor(config) {
        return config;
      },
      requestInterceptorError = function requestInterceptorError(error) {
        return Promise.reject(error);
      },
      responseInterceptor = function responseInterceptor(response) {
        return response.data;
      },
      responseInterceptorError = function responseInterceptorError(error) {
        return Promise.reject(error);
      }
    } = {}
  ) {
    let instance;
    if (typeof baseURL === "string") {
      instance = axios.create({ baseURL });
    } else {
      instance = axios.create();
    }
    instance.interceptors.request.use(
      requestInterceptor,
      requestInterceptorError
    );
    instance.interceptors.response.use(
      responseInterceptor,
      responseInterceptorError
    );
    return instance.post("/cart/change.js", { quantity: 0, id: key });
  },
  changeItemByLine(
    quantity,
    line,
    {
      baseURL = undefined,
      requestInterceptor = function requestInterceptor(config) {
        return config;
      },
      requestInterceptorError = function requestInterceptorError(error) {
        return Promise.reject(error);
      },
      responseInterceptor = function responseInterceptor(response) {
        return response.data;
      },
      responseInterceptorError = function responseInterceptorError(error) {
        return Promise.reject(error);
      }
    } = {}
  ) {
    let instance;
    if (typeof baseURL === "string") {
      instance = axios.create({ baseURL });
    } else {
      instance = axios.create();
    }
    instance.interceptors.request.use(
      requestInterceptor,
      requestInterceptorError
    );
    instance.interceptors.response.use(
      responseInterceptor,
      responseInterceptorError
    );
    return instance.post("/cart/change.js", { quantity: quantity, line });
  },
  removeItemByLine(
    line,
    {
      baseURL = undefined,
      requestInterceptor = function requestInterceptor(config) {
        return config;
      },
      requestInterceptorError = function requestInterceptorError(error) {
        return Promise.reject(error);
      },
      responseInterceptor = function responseInterceptor(response) {
        return response.data;
      },
      responseInterceptorError = function responseInterceptorError(error) {
        return Promise.reject(error);
      }
    } = {}
  ) {
    let instance;
    if (typeof baseURL === "string") {
      instance = axios.create({ baseURL });
    } else {
      instance = axios.create();
    }
    instance.interceptors.request.use(
      requestInterceptor,
      requestInterceptorError
    );
    instance.interceptors.response.use(
      responseInterceptor,
      responseInterceptorError
    );
    return instance.post("/cart/change.js", { quantity: 0, line });
  },
  addItem(
    id,
    quantity,
    properties,
    {
      baseURL = undefined,
      requestInterceptor = function requestInterceptor(config) {
        return config;
      },
      requestInterceptorError = function requestInterceptorError(error) {
        return Promise.reject(error);
      },
      responseInterceptor = function responseInterceptor(response) {
        return response.data;
      },
      responseInterceptorError = function responseInterceptorError(error) {
        return Promise.reject(error);
      }
    } = {}
  ) {
    let instance;
    if (typeof baseURL === "string") {
      instance = axios.create({ baseURL });
    } else {
      instance = axios.create();
    }
    instance.interceptors.request.use(
      requestInterceptor,
      requestInterceptorError
    );
    instance.interceptors.response.use(
      responseInterceptor,
      responseInterceptorError
    );
    return instance.post("/cart/add.js", {
      id: id,
      quantity: quantity,
      properties: properties
    });
  },
  addItemFromForm(
    form,
    {
      baseURL = undefined,
      requestInterceptor = function requestInterceptor(config) {
        return config;
      },
      requestInterceptorError = function requestInterceptorError(error) {
        return Promise.reject(error);
      },
      responseInterceptor = function responseInterceptor(response) {
        return response.data;
      },
      responseInterceptorError = function responseInterceptorError(error) {
        return Promise.reject(error);
      }
    } = {}
  ) {
    let instance;
    if (typeof baseURL === "string") {
      instance = axios.create({ baseURL });
    } else {
      instance = axios.create();
    }
    instance.interceptors.request.use(
      requestInterceptor,
      requestInterceptorError
    );
    instance.interceptors.response.use(
      responseInterceptor,
      responseInterceptorError
    );
    return instance.post("/cart/add.js", new FormData(form));
  }
};
