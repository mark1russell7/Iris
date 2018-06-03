var Entry = function Entry(key, value){
  this.key = key;
  this.value = value;
  this.getValue = function(){
    return this.value;
  }
  this.setValue = function(value){
    this.value = value;
  }
  this.getKey = function(){
    return this.key;
  }
  this.setKey = function(key){
    this.key = key;
  }
}
