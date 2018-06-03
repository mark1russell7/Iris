var PriorityQueue = function PriorityQueue(size=16){
  this.hashMap = new HashMap();
  this.queue = new Array(size);
  this.pos = 1;
  this.getBubbleOfKey = function(key){
    return this.queue[this.hashMap.getValue(key)];
  }
  this.isEmpty = function(){
    return this.pos === 1;
  }
  this.contains = function(key){
    return this.hashMap.hasKey(key);
  }
  this.heapify = function(key){
    if(!key || !key.key){
      return;
    }
    var p = this.hashMap.getValue(key.key);
    if(this.parent(p) < this.pos && this.queue[this.parent(p)] && this.queue[this.parent(p)].priority > key.priority){
      this.heapifyUp(key);
    }else if(this.left(p) >= 1 && this.left(p) < this.pos && this.queue[this.left(p)].priority < key.priority ||
    this.right(p) >= 1 && this.right(p) < this.pos && this.queue[this.right(p)].priority < key.priority){
      this.heapifyDown(key);
    }
  }
  this.heapifyUp = function(key){
    var i = this.hashMap.getValue(key.key);
    while(i >= 1 && this.queue[i] && this.queue[i].priority < this.queue[this.parent(i)].priority){
      this.swap(i, this.parent(i));
      i = this.parent(i);
    }
  }
  this.heapifyDown = function(key){
    var i = this.hashMap.getValue(key.key);
    var l = this.left(i);
    var r = this.right(i);
    var smallest;
    if(l < this.pos && this.queue[l].priority < this.queue[i].priority){
      smallest = l;
    }else {
      smallest = i;
    }
    if(r < this.pos && this.queue[r].priority < this.queue[smallest].priority){
      smallest = r;
    }
    if(smallest !== i){
      this.swap(i, smallest);
      this.heapifyDown(this.queue[smallest]);
    }
  }
  this.resize = function(){
    var newQueue = new Array(this.queue.length *2);
    for(var index = 1; index < this.queue.length; ++index){
      newQueue[index] = this.queue[index];
    }
    this.queue = newQueue;
  }
  this.insert = function(key, priority){
    if(this.pos === this.queue.length){
      this.resize();
    }
    this.hashMap.set(key, this.pos);
    this.queue[this.pos] = new PQNode(key, priority);
    this.pos++;
    this.heapify(this.queue[this.pos-1]);
  }
  this.pullMax = function(){
    var min = this.queue[1];
    this.pos--;
    this.swap(1, this.pos);
    this.hashMap.set(this.queue[this.pos].key, -1);
    this.queue[this.pos] = null;
    this.heapify(this.queue[1]);
    return min;
  }
  this.rebalance = function(key){
    this.heapify(key);
  }
  this.swap = function(i, j){
    var temp = this.queue[i];
    this.queue[i] = this.queue[j];
    this.queue[j] = temp;
    this.hashMap.set(this.queue[i].key, i);
    this.hashMap.set(this.queue[j].key, j);
  }
  this.parent = function (i){
    return i === 1 ? 1 : Math.floor(i/2);
  }
  this.right = function(i){
    return 2*i +1;
  }
  this.left = function(i){
    return 2 *i;
  }
  this.clone = function(){
    let PQCopy = new PriorityQueue(this.queue.length);
    for(let index = 0; index <= this.pos; index++){
      if(this.queue[index])
        PQCopy.insert(this.queue[index].key, this.queue[index].priority);
    }
    return PQCopy;
  }

}
