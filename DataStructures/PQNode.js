var PQNode = function PQNode(key, priority){
  this.key = key;
  this.priority = priority;
  this.toString = function(){
    return this.key.toString();
  }
}
