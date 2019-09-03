import ShopifyAPI from "../ShopifyAPI";
const { getCart } = ShopifyAPI;

export default {
  pbHandleCart(cart) {
    return new Promise(function(resolve, reject) {
      try {
        if (typeof window.shappify_pb_got_cart === "function") {
          if (cart && cart.token) {
            window.shappify_pb_got_cart(cart, resolve);
          } else {
            getCart().then(function(cart) {
              window.shappify_pb_got_cart(cart, resolve);
            });
          }
        } else {
          if (cart && cart.token) {
            resolve(cart);
          } else {
            getCart().then(resolve);
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }
};
