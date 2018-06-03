var LinkedList = function LinkedList(){
  this.head = null;
  this.size = 0;
  this.addLast = function(data){
    if(this.size == 0){
      this.head = new Node(null, null, data);
      this.head.setLeft(this.head);
      this.head.setRight(this.head);
      this.size++;
      return true;
    }
    var node = new Node(this.head.getLeft(), this.head, data);
    this.head.getLeft().setRight(node);
    this.head.setLeft(node);
    this.size++;
    return false;
  }
  this.addFirst = function(data){
    if(addLast(data))
      this.head = this.head.getLeft();
  }
  this.search = function(data){
    var iterator = new Iterator(this);
    while(iterator.hasNext()){
      if(iterator.get().data === data)
        return true;
    }
    return false;
  }
  this.remove = function(data){
    var cur = this.head;
    for(var index = 0; index <= this.size; index++){
      if(cur.getData() === data){
        cur.getLeft().setRight(cur.getRight());
        cur.getRight().setLeft(cur.getLeft());
        size--;
        if(this.head === cur)
          this.head = cur.getRight();
        return true;
      }
      cur = cur.getRight();
    }
    return false;
  }
  this.addAll = function(list){
    var iterator = new Iterator(list);
    while(iterator.hasNext()){
      this.addLast(iterator.get());
      iterator.next();
    }
  }
}
var Node = function Node(left=null, right=null, data=null){
  this.left = left;
  this.right = right;
  this.data = data;
  this.setData = function(data){
    this.data = data;
  }
  this.setLeft = function(left){
    this.left = left;
  }
  this.setRight = function(right){
    this.right = right;
  }
  this.getData = function(){
    return this.data;
  }
  this.getLeft = function(){
    return this.left;
  }
  this.getRight = function(){
    return this.right;
  }
}
