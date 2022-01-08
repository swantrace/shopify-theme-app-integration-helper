# xJS - shopify app and theme integration helpers

<img width="48" height="48" src="http://www.shejiye.com/uploadfile/icon/2017/0203/shejiyeiconbhkcxbhtwmg.png"/>

When we need to write custom js code to fix issues or integrate Shopify apps and theme. The library's goal is to make every function that can be used for different tickets not necessary to be written manually again or import jQuery.

### It is composed of differnt parts:

1. DOM Traversing and manipulation helper functions
2. Event Handling helper functions
3. JS utilities
4. Shopify Ajax API helper functions
5. Custom Element Creation helper function
6. Helper functions to watch changes to the DOM
7. Debugging Tools:
   1. find where a specific HTMLElement is changed.
   2. find where a specifi object is changed.
   3. find which stopPropagation or stopImmediatePropagation run

Syntax demos:

```javascript
var elem = document.getElementById('foo');
var xElem = X(elem);

xElem.css("background-color" "green").html("Hello World");

xElem.on("click" function() {
  $("#someDiv").css("background-color:green;color:#fff;");
});

X.api.addItemFromForm(form)
.then(function(cart){
  ...
})
```

API

### DOM Traversing and manipulation helper functions

- X(HTMLElement).find
- X(HTMLElement).empty
- X(HTMLElement).after
- X(HTMLElement).before
- X(HTMLElement).appendTo
- X(HTMLElement).prependTo
- X(HTMLElement).remove
- X(HTMLElement).removeClass
- X(HTMLElement).addClass
- X(HTMLElement).hasClass
- X(HTMLElement).toggleClass
- X(HTMLElement).replaceClass
- X(HTMLElement).matches
- X(HTMLElement).children
- X(HTMLElement).siblings
- X(HTMLElement).first
- X(HTMLElement).last
- X(HTMLElement).prev
- X(HTMLElement).next
- X(HTMLElement).prevAll
- X(HTMLElement).nextAll
- X(HTMLElement).parents
- X(HTMLElement).parentsUntil
- X(HTMLElement).parent
- X(HTMLElement).removeAttr
- X(HTMLElement).removeAttrExcept
- X(HTMLElement).fdObj
- X(HTMLElement).val
- X(HTMLElement).append
- X(HTMLElement).prepend
- X(HTMLElement).insertBefore
- X(HTMLElement).insertAfter
- X(HTMLElement).wrapEachChildWith
- X(HTMLElement).wrapAllChildrenWith
- X(HTMLElement).unwrapEachChild
- X(HTMLElement).replaceWith
- X(HTMLElement).dispatchCustomEvent
- X(HTMLElement).show
- X(HTMLElement).hide
- X(HTMLElement).toggle
- X(HTMLElement).fadeIn
- X(HTMLElement).fadeOut
- X(HTMLElement).fadeTo
- X(HTMLElement).fadeToggle
- X(HTMLElement).slideDown
- X(HTMLElement).slideUp
- X(HTMLElement).css
- X(HTMLElement).attr
- X(HTMLElement).data
- X(HTMLElement).parseHTML
- X(HTMLElement).animate
- X(HTMLElement).animate

### Helper functions to watch changes to the DOM

- X(HTMLElement).onceTextAdded
- X(HTMLElement).onceAttributeAdded
- X(HTMLElement).onceNodeAdded
- X(HTMLElement).onceNodeRemoved
- X(HTMLElement).onceAttributeRemoved
- X(HTMLElement).onceTextRemoved
- X(HTMLElement).onAttributeAdded
- X(HTMLElement).onAttributeRemoved
- X(HTMLElement).onNodeAdded
- X(HTMLElement).onNodeRemoved
- X(HTMLElement).onTextAdded
- X(HTMLElement).onTextRemoved
- X(HTMLElement).on
- X(HTMLElement).off
- X(HTMLElement).once

### Custom Element Creation helper function

- X.define

### Shopify Ajax API helper functions

- X.api.getCart
- X.api.getProduct
- X.api.clearCart
- X.api.updateCartFromForm
- X.api.changeItemByKey
- X.api.removeItemByKey
- X.api.changeItemByLine
- X.api.removeItemByLine
- X.api.addItem
- X.api.addItemFromForm

### general shopify helper functions

- X.formatMoney
- X.toggleCheckout
- X.isValidATCForm
- X.hideCheckoutButtons
- X.showCheckoutButtonsHiddenByUs
- X.quantityInputValuesInAgreementWithCartObject
- X.toggleFocusInFocusOutEventListenersOfElement
- X.addCSS
- X.addJS
- X.onScriptsLoaded
- X.affirmUpdatePrice
