// Defaults
const startMode, inf;
//

var ComponentManager = function ComponentManager(mode=startMode){
  this.currentMode = mode;
  this.childrenMap = new HashMap(); // fill this
  this.load = function(mode){
  }
  this.unload = function(component, actions){
    var actionIterator = new Iterator(actions);
    while(actionIterator.hasNext()){
      actionIterator.get().reverse();
      actionIterator.next();
    }
    component.unload();
    var subIterator = new Iterator(component.subcomponents());
    while(subIterator.hasNext()){
      var intertwined = this.childrenMap.get(subIterator.get());
      intertwined.remove(subIterator.get()); // Remove all Parents too
      if(numSeparateTrees(intertwined) >= 1){
        if(subIterator.get().held()){
          subIterator.next();
        }else if(allUnloaded(intertwined)){
          this.unload(subIterator.get(), subIterator.get().actions());
          subIterator.next();
        }else{
          var dependents = findDependents(component, intertwined);
          subIterator.get().actions().addAll(conglomerate(dependents, subIterator.get()));
          this.unload(subIterator.get(), subIterator.get().actions());
          subIterator.next();
          // if(numSeparateTrees(intertwined) === 1){
          //   subIterator.get().actions().addAll(conglomerate(dependents, subIterator.get()));
          //   this.unload(subIterator.get(), subIterator.get().actions());
          //   subIterator.next();
          // }else{
          //   var orderResponse = order(dependents, subIterator.get());
          //   var result = orderResponse.result(); // should be true if the order is non arbitrary or the arbitrary actions are the same
          //   var conflicts = orderResponse.conflicts();
          //   if(result.getResult()){
          //     this.unload(subIterator.get(), result.getResolution());
          //     subIterator.next();
          //   }else{
          //     if(conflicts.allResolvable()){
          //       this.unload(subIterator.get(), conflicts.resolution());
          //       subIterator.next();
          //     }else{ // Load conflict of the first order
          //       if(conflicts.containsStrict()){
          //         // throw a Major Error:
          //         /*
          //         ERROR MESSAGE
          //
          //         Compile did not find this conflict and hence
          //         the components A0...AN have not been sufficiently
          //         checked for cross component compatability.
          //
          //         Describe the source of the conflict and send this
          //         bug to IT RedLine for immediate fixing
          //         */
          //       }else{
          //         // throw a Minor Error:
          //         /*
          //         ERROR MESSAGE
          //
          //         Arbitrary load order for the compoenents A0...AN detected.
          //
          //         Send this to IT or catch the error
          //         */
          //         // throw ArbitraryLoadOrderException();
          //         this.unload(subIterator.get(), arbitraryConglomerate(conflicts.raw()));
          //         subIterator.next();
          //       }
          //     }
          //   }
          // }
        }
      }else{
        this.unload(subIterator.get(), subIterator.get().actions());
        subIterator.next();
      }
    }
  }
}

function findDependents(component, intertwined){
  var dependents = new LinkedList():
  var iterator = new Iterator(intertwined);
  while(iterator.hasNext()){
    if(isDependent(component, iterator.get())){
      dependents.addLast(iterator.get());
    }else if(iterator.get().parent !== null && !intertwined.search(iterator.get().parent)){
      intertwined.addLast(iterator.get().parent());
    }
    iterator.next();
  }
}
function isDependent(component, parent){
  var actionIterator = new Iterator(parent.actions());
  while(actionIterator.hasNext()){
    if(actionIterator.get().object().getClass() === component.getClass())
      return true;
    actionIterator.next();
  }
  return parent.parent !== null && isDependent(component, parent.parent);
}

//
// function order(dependents, component){
//   var result = isArbitraryOrSame(dependents, component);
//   // get the actions and save as resolution;
//   var resolution;
//   var resObj = new resolutionObject(result, resolution);
//
//   var allResolvable = notArbitrary(dependents, component);
//   var resolutionC = conglomerate(dependents, actions);
//   var containsStrict = contStr(dependents, component);
//   var raw = getRaw(dependents, component);
//   var confObj = new conflictObject(raw, allResolvable, containsStrict, resolutionC);
//
//   var orderObject = new orderObject(resObj, confObj);
//   return orderObject;
// }
// function getRaw(dependents, component){
//   var raw = new LinkedList();
//   var depItr = new Iterator(dependents);
//   while(depItr.hasNext()){
//     var actItr = new Iterator(depItr.get().actions());
//     while(actItr.hasNext()){
//       if(actItr.get().object().getClass() === component.getClass())
//         raw.addLast(actItr.get());
//       actItr.next();
//     }
//     depItr.next();
//   }
//   return raw;
// }
  function conglomerate(dependents, component){
    var raw = new LinkedList();
    var depItr = new Iterator(dependents);
    while(depItr.hasNext()){
      var actItr = new Iterator(depItr.get().actions());
      while(actItr.hasNext()){
        if(actItr.get().object().getClass() === component.getClass())
          raw.addLast(actItr.get());
        actItr.next();
      }
      depItr.next();
    }
    return raw;
  }
// function arbitraryConglomerate(actions){
//
// }
// function contStr(dependents, component){
//
// }
// function isArbitraryOrSame(dependents, component){
//
// }
// function notArbitrary(dependents, component){
//   var hashmap = new HashMap();
//   var depItr = new Iterator(dependents);
//   var actionSet = new Set();
//   while(depItr.hasNext()){
//     actionSet.add(depItr.get());
//     var node = new Node(null,null,depItr.get());
//     var entry = new Entry(depItr.get(), node);
//     hashmap.insert(entry);
//     depItr.next();
//   }// add insert between functionality to LinkedList for both single nodes and entire lists
//   var listOfLists = new LinkedList();
//   while(actionSet.size() > 0){
//     var actionItr = new Iterator(dependents);
//     while(actionItr.hasNext()){
//
//       actionItr.next();
//     }
//   }
// }
// var orderObject = function orderObject(res, conf){
//   this.res = res;
//   this.conf = conf;
//   this.result = function(){
//     return this.res;
//   }
//   this.conflict = function(){
//     return this.conf;
//   }
// }
// var resolutionObject = function resolutionObject(result, resolution){
//   this.result = result;
//   this.resolution = resolution;
//   this.getResult = function(){
//     return this.result;
//   }
//   this.getResolution = function(){
//     return this.resolution;
//   }
// }
// var conflictObject = function conflictObject(rawActions, allRes, cs, res){
//   this.rawActions = rawActions;
//   this.allRes = allRes;
//   this.cs = cs;
//   this.res = res;
//   this.resolution = function(){
//     return this.res;
//   }
//   this.containsStrict = function(){
//     return this.cs;
//   }
//   this.allResolvable = function(){
//     return this.allRes;
//   }
//   this.raw = function(){
//     return this.rawActions;
//   }
//
// }

function allUnloaded(list){
  var iterator = new Iterator(list);
  while(iterator.hasNext())
    if(!iterator.get().unloaded())
      return false;
  return true;
}
function numSeparateTrees(intertwined){
  var iterator = new Iterator(intertwined);
  var treeSet = new Set();
  while(iterator.hasNext())
    treeSet.add(iterator.get().tree());
  return treeSet.size();
}


function getLCAs(leaves, tree){
  var iterator = new Iterator(leaves);
  var LCAs = new Set();

  var v = iterator.get();
  var w;
  while(iterator.hasNext()){
    iterator.next();
    w = iterator.get();
    LCAs.add(LCA(v,w,tree));
    v = w;
  }
  return LCAs;
}

// Define inf as a node with a special field
function LCA(v,w,t){
  if(v.parent === inf)
    return v;
  else if(w === t.root)
    return LCA(v.parent, w, t);
  else{
    var vP = v.parent;
    v.parent = inf;
    var lo = LCA(w,vP,t);
    v.parent = vP;
    return lo;
  }
}
