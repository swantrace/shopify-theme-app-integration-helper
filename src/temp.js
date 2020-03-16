// var variantIdProductHandlePairs = {};
// var infoCollectFnCreator = function(handleFn) {
//   var page = 1;
//   var getProducts = function getProducts() {
//     axios.get("/products.json?limit=50&page=" + page)
//     .then(function(response){
//       return response.data;
//     })
//     .then(function(data){
//       handleFn(data)
//       if(data.products.length >= 50){
//         page++;
//         getProducts(handleFn);
//       }
//     });
//   }
//   return getProducts;
// }

// var infoCollectFn = infoCollectFnCreator(function(data){
//   var products = data.products;
//   products.forEach(function(cur){
//     cur.variants.forEach(function(variant){
//       variantIdProductHandlePairs[variant.id] = cur.handle;
//     })
//   })
// });

// infoCollectFn();
