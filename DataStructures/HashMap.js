var HashMap = function HashMap(){
  // this.keyType = keyType;
  // this.valueType = valueType;
  this.maxLoadFactor = .5;
  this.hashTable = new Array(2);
  this.hashTable[0] = new Array(16);
  this.hashTable[1] = new Array(16);
  this.num = 0;
  this.loadFactor = 0.0;
  this.clone = function(){
    let hashTableCopy = new Array(2);
    hashTableCopy[0] = new Array(this.hashTable[0].length);
    hashTableCopy[1] = new Array(this.hashTable[1].length);
    let numCopy = this.num;
    let loadFactorCopy = this.loadFactor;
    for(let index = 0; index < hashTableCopy[0].length; index++){
      hashTableCopy[0][index] = this.hashTable[0][index];
      hashTableCopy[1][index] = this.hashTable[1][index];
    }
    let hm = new HashMap();
    hm.hashTable = hashTableCopy;
    hm.num = numCopy;
    hm.loadFactor = loadFactorCopy;
    return hm;

  }
  this.hasKey = function(key){
    // if(key instanceof keyType)
      return this.get(key) !== null;
  }
  this.getValue = function(key){
    // if(key instanceof keyType){
      var val = this.get(key);
      return val ? val.getValue() : -1;
    // }
  }
  this.updateLoadFactor = function(){
    this.loadFactor = this.num/((2.0 * this.hashTable[0].length));
    if(this.loadFactor >= this.maxLoadFactor)
      this.resize();
  }
  this.set = function(key, value){
    // if(key instanceof this.keyType && value instanceof this.valueType){
      var find = this.get(key);
      if(!find){
        this.num++;
        this.updateLoadFactor();
        this.insert(new Entry(key, value));
      }else{
        if(find.getValue() === -1){
          this.num++;
          this.updateLoadFactor();
        }
        find.setValue(value);
      }
    // }
  }
  this.resize = function(){
    var nht = new Array(2);
    nht[0] = new Array(this.hashTable[0].length*2);
    nht[1] = new Array(this.hashTable[0].length*2);
    var old = this.hashTable;
    this.hashTable = nht;
    for(var index = 0; index < old.length; index++){
      for(var indexIn = 0; indexIn < old[index].length; indexIn++){
        this.insert(old[index][indexIn]);
      }
    }
    this.updateLoadFactor();
  }
  this.insert = function(entry){
    var tries = 0;
    var lastTableNumber = 1;
    while(entry){
      if(tries >= this.hashTable[0].length + this.hashTable[1].length){
        this.resize();
        tries = 0;
      }
      if(!this.hasKey(entry.getKey()) || this.getValue(entry.getKey()) === -1){
        if(lastTableNumber === 0){
          var hash2 = this.hashTwo(entry.getKey());
          var temp = this.hashTable[1][hash2];
          this.hashTable[1][hash2] = entry;
          entry = temp;
          tries++;
          lastTableNumber = 1;
        }else{
          var hash1 = this.hashOne(entry.getKey());
          var temp = this.hashTable[0][hash1];
          this.hashTable[0][hash1] = entry;
          entry = temp;
          tries++;
          lastTableNumber = 0;
        }
      }
    }
  }
  this.hashOne = function(key){
    var hash = 1;
    var string = key.toString();
    for(var index = 0; index < string.length; index++){
        hash = 17*hash + string.charCodeAt(index);
    }
    return Math.abs(Math.floor(hash)%this.hashTable[0].length);
  }
  this.hashTwo = function(key){
    var hash = 1;
    var string = key.toString();
    for(var index = 0; index < string.length; index++){
        hash = 31*hash + string.charCodeAt(index);
    }
    return Math.abs(Math.floor(hash)%this.hashTable[0].length);
  }
  this.get = function(key){
    var hash1 = this.hashOne(key);
    var hash2 = this.hashTwo(key);
    if(this.hashTable[0][hash1] && this.hashTable[0][hash1].getKey().toString() === (key.toString()))
      return this.hashTable[0][hash1];
    else if(this.hashTable[1][hash2] && this.hashTable[1][hash2].getKey().toString() === (key.toString()))
      return this.hashTable[1][hash2];
    else
      return null;
  }

}
