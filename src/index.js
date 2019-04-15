import Sizzle from 'sizzle';
import axios from 'axios';


const XElement = function(htmlElement){
  this.element = htmlElement;
  this.init();
}

XElement.prototype.init = function(){
  for(let key in this.element){
    if(typeof this.element[key] === 'function'){
      XElement.prototype[key] = this.element[key].bind(this.element);
    }
  }
}


XElement.prototype.catch = function(
  selector = throwIfMissing('selector'),  
  {
    callback = function(htmlElement){
      console.log(htmlElement);
    },
    times = Number.MAX_SAFE_INTEGER,
    first_time = true
  } = {}
){
  const currentElement = this.element;
  const options = {childList: true, attributes: true, characterData: true};
  const initialElements = Sizzle(selector, currentElement);
  if(first_time){
    initialElements.forEach(function(initialElement){
      callback(initalElement);
    });
  }
  this.observer = new MutationObserver(function(mutationsList, observer){
    let relatedElements = [];
    mutationsList.forEach(function(mutationRecord){
      if(mutationRecord.type === 'childList'){
        mutationRecord.addedNodes.forEach(function(addedNode){
          if(addedNode.nodeType === Node.TEXT_NODE){
            addedNode = addedNode.parentNode;
          }
          if(Sizzle.matchesSelector(addedNode, selector)){
            relatedElements.push(addedNode);
          } else if(Sizzle(selector, addedNode) && Sizzle(selector, addedNode).length > 0){
            relatedElements = relatedElements.concat(Sizzle(selector, addedNode));
          }
        });
      }
      if(mutationRecord.type === 'attributes'){
        if(!initialElements.includes(mutationRecord.target) && Sizzle.matchesSelector(mutationRecord.target, selector)){
          relatedElements.push(mutationRecord.target);
        }
      }
      if(mutationRecord.type === 'characterData'){
        if(mutationRecord.target.parentNode && !initialElements.includes(mutationRecord.target.parentNode) && Sizzle.matchesSelector(mutationRecord.target.parentNode, selector)){
          relatedElements.push(mutationRecord.target.parentNode);
        }
      }
    });

    relatedElements = relatedElements.filter(function(relatedElement, index, relatedElements){
      return relatedElements.indexOf(relatedElement) === index;
    });

    if(relatedElements.length > 0){
      observer.disconnect();
      relatedElements.forEach(function(relatedElement){
        callback(relatedElement);
      });
    }
    if(--times > 0) {
      observer.observe(currentElement, options);
    }  
  });
  this.observer.observe(currentElement, options);
}

XElement.prototype.lose = function(
  selector = throwIfMissing('selector'), 
  {
    callback = function(htmlElement){
      console.log(htmlElement);
    },
    times = Number.MAX_SAFE_INTEGER
  } = {}
){
  const currentElement = this.element;
  const options = {childList: true, attributes: true, characterData: true, attributeOldValue: true, characterDataOldValue: true};

  this.observer = new MutationObserver(function(mutationsList, observer){
    let relatedElements = [];
    mutationsList.forEach(function(mutationRecord){
      if(mutationRecord.type === 'childList'){
        mutationRecord.removedNodes.forEach(function(removedNode){
          const clonedMutationTarget = mutationRecord.target.cloneNode(true);
          clonedMutationTarget.appendChild(removedNode);
          if((!Sizzle.matchesSelector(mutationRecord.target, selector)
             && (Sizzle.matchesSelector(clonedMutationTarget, selector))
             || (Sizzle(selector, clonedMutationTarget).length > Sizzle(selector, mutationRecord.target).length))){
            relatedElements.push(mutationRecord.target);
          } 
        });
      }
      if(mutationRecord.type === 'attributes'){
        const clonedMutationTarget = mutationRecord.target.cloneNode(true);
        clonedMutationTarget.setAttribute(MutationRecord.attributeName, MutationRecord.oldValue);
        if((!Sizzle.matchesSelector(mutationRecord.target, selector)
            && (Sizzle.matchesSelector(clonedMutationTarget, selector))
            || (Sizzle(selector, clonedMutationTarget).length > Sizzle(selector, mutationRecord.target).length))){
          relatedElements.push(mutationRecord.target);
        }         
      }
      if(mutationRecord.type === 'characterData'){
        let currentTextContent = mutationRecord.target.textContent;
        mutationRecord.target.textContent = mutationRecord.oldValue;
        const clonedMutationTargetParent = mutationRecord.target.parentNode.cloneNode(true);
        mutationRecord.target.textContent = currentTextContent;
        if((!Sizzle.matchesSelector(mutationRecord.target.parentNode, selector)
            && (Sizzle.matchesSelector(clonedMutationTargetParent, selector))
            || (Sizzle(selector, clonedMutationTargetParent).length > Sizzle(selector, mutationRecord.target).length))){
          relatedElements.push(mutationRecord.target);
        }  
      }
    });

    relatedElements = relatedElements.filter(function(relatedElement, index, relatedElements){
      return relatedElements.indexOf(relatedElement) === index;
    });

    if(relatedElements.length > 0){
      observer.disconnect();
      relatedElements.forEach(function(relatedElement){
        callback(relatedElement);
      });
    }
    if(--times > 0) {
      observer.observe(currentElement, options);
    }  
  });
  this.observer.observe(currentElement, options);
}



function throwIfMissing(name) {
  throw new Error(`Missing a ${name} as the parameter`);
}


var X = function(htmlElement){
  return (function(){
    var x = new XElement(htmlElement);
    return x;
  })();
}



let xbody = X(document.body);
xbody.catch(".test", {callback: function(){ console.log(arguments); }});
document.body.insertAdjacentHTML('beforeend', '<div class="test">hello</div>');
document.body.insertAdjacentHTML('beforeend', '<div class="test">hello</div>');
document.body.insertAdjacentHTML('beforeend', '<div class="test">hello</div>');
document.body.insertAdjacentHTML('beforeend', '<div class="test">hello</div>');
xbody.lose(".test", {callback: function(){ console.log(arguments); }})

X.find = Sizzle;
X.ajax = axios;
window.X = X;
window.xbody = xbody;
