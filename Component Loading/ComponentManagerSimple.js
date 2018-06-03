// Defaults
let startMode;
//

let ComponentManager = function ComponentManager(mode=startMode){
  this.currentMode = mode;
  this.loaded = new Set();
  this.loadedList = new LinkedList();
  this.held = new Set();
  this.heldList = new LinkedList();
  this.load = function(mode){
    this.held.add(mode);
    this.heldList.addLast(mode);
    this.holdAllSub(mode);
    this.unload(this.currentMode);
    this.loadHelp(mode);
    this.currentMode = mode;
  };
  this.loadHelp = function(component){
    if(component.subcomponents !== null){
      let subIterator = new Iterator(component.subcomponents);
      while(subIterator.hasNext()){
        if(!loaded.has(subIterator.get().getClass()))
          this.loadHelp(subIterator.get());
        subIterator.next();
      }
    }
    component.load();
    this.loadedList.addLast(component.getClass());
    this.loaded.add(component.getClass());
    if(component.actions !== null){
      let actionItr = new Iterator(component.actions);
      while(actionItr.hasNext()){
        actionItr.get().invoke();
        actionItr.next();
      }
    }
  };
  this.holdAllSub = function(component){
    let tmp = new Iterator(component.subcomponents);
    while(tmp.hasNext()){
      this.held.add(tmp.get());
      this.heldList.addLast(tmp.get());
      if(tmp.get().subcomponents !== null)
        getAllSub(tmp.get());
      tmp.next();
    }
  };

  this.unload = function(component, actions){
    let actionIterator = new Iterator(actions);
    while(actionIterator.hasNext()){
      actionIterator.get().reverse();
      actionIterator.next();
    }
    component.unload();
    let subIterator = new Iterator(component.subcomponents);
    while(subIterator.hasNext()){
      let intertwined = getAllDep(this.loadedList, this.heldList, subIterator.get());
      let intertwinedItr = new Iterator(intertwined);
      while(intertwinedItr.hasNext()){
        if(intertwinedItr.get().tree === subIterator.get().tree)
          intertwinedItr.remove();
        intertwinedItr.next();
      }
      if(numSeparateTrees(intertwined) >= 1){
        if(this.held.has(subIterator.get())){
          subIterator.next();
        }else if(allUnloaded(intertwined)){
          this.loaded.remove(subIterator.get().getClass());
          this.loadedList.remove(subIterator.get().getClass());
          this.unload(subIterator.get(), subIterator.get().actions);
          subIterator.next();
        }else{
          let dependents = findDependents(component, intertwined);
          subIterator.get().actions.addAll(conglomerate(dependents, subIterator.get()));
          this.loaded.remove(subIterator.get().getClass());
          this.loadedList.remove(subIterator.get().getClass());
          this.unload(subIterator.get(), subIterator.get().actions);
          subIterator.next();
        }
      }else{
        this.loaded.remove(subIterator.get().getClass());
        this.loadedList.remove(subIterator.get().getClass());
        this.unload(subIterator.get(), subIterator.get().actions);
        subIterator.next();
      }
    }
  }
};
function getAllDep(loaded, held, component){
  let all = new LinkedList();
  all.addAll(loaded);
  all.addAll(held);
  let nodes = new LinkedList();
  let allItr = new Iterator(all);
  while(allItr.hasNext()){
    let actionItr = new Iterator(allItr.get().actions);
    while(actionItr.hasNext()){
      if(actionItr.get().object().getClass() === component.getClass())
        nodes.addLast(actionItr.get());
      actionItr.next();
    }
    allItr.next();
  }
  return nodes;
}

function findDependents(component, intertwined){
  let dependents = new LinkedList();
  let iterator = new Iterator(intertwined);
  while(iterator.hasNext()){
    if(isDependent(component, iterator.get())){
      dependents.addLast(iterator.get());
    }else if(iterator.get().parent !== null && !intertwined.search(iterator.get().parent)){
      intertwined.addLast(iterator.get().parent);
    }
    iterator.next();
  }
}
function isDependent(component, parent){
  let actionIterator = new Iterator(parent.actions);
  while(actionIterator.hasNext()){
    if(actionIterator.get().object().getClass() === component.getClass())
      return true;
    actionIterator.next();
  }
  return parent.parent !== null && isDependent(component, parent.parent);
}

function conglomerate(dependents, component){
  let raw = new LinkedList();
  let depItr = new Iterator(dependents);
  while(depItr.hasNext()){
    let actItr = new Iterator(depItr.get().actions);
    while(actItr.hasNext()){
      if(actItr.get().object().getClass() === component.getClass())
        raw.addLast(actItr.get());
      actItr.next();
    }
    depItr.next();
  }
  return raw;
}

function allUnloaded(list){
  let iterator = new Iterator(list);
  while(iterator.hasNext())
    if(!iterator.get().unloaded())
      return false;
  return true;
}
function numSeparateTrees(intertwined){
  let iterator = new Iterator(intertwined);
  let treeSet = new Set();
  while(iterator.hasNext())
    treeSet.add(iterator.get().tree);
  return treeSet.size();
}
