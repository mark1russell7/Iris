var Iterator = function Iterator(list){
  this.list = list;
  this.traversed = false;
  this.cur = this.list.head;
  this.next = function(){
    this.cur = this.cur.getRight();
    this.traversed = true;
  }
  this.get = function(){
    return this.cur.getData();
  }
  this.remove = function(data){
    if(data === this.cur.getData()){
      this.cur.getLeft().setRight(this.cur.getRight());
      this.cur.getRight().setLeft(this.cur.getLeft());
      this.list.size--;
      if(this.list.head === cur)
        this.list.head = cur.getRight();
    }else{
      this.list.remove(data);
    }
  }
  this.hasNext = function(){
    return this.list.size > 0 && this.cur !== this.list.head ^ !this.traversed;
  }
}
