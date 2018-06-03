// key must have compareTo method
var SplayNode = function SplayNode(key){
  this.key = key;
  this.parent = null;
  this.leftChild = null;
  this.rightChild = null;

  this.search = function(key){
    var node = this.searchNoSplay(key);
    node.splay();
    return node;
  }
  this.searchNoSplay = function(key){
    if(this.getKey().compareTo(key) === 0){
      return this;
    }else{
      if(this.getKey().compareTo(key) < 0){
        if(this.hasRight()){
          return this.getRightChild().searchNoSplay(key);
        }else{
          return this;
        }
      }else if(this.getKey().compareTo(key) > 0){
        if(this.hasLeft()){
          return this.getLeftChild().searchNoSplay(key);
        }else{
          return this;
        }
      }
    }
    return this;
  }
  this.contains = function(key){
    var root = this;
    while(root){
      if(root.getKey().compareTo(key) === 0){
        return true;
      }else{
        if(root.getKey().compareTo(key) === 0){
          root = root.getRightChild();
        }else if(root.getKey().compareTo(key) > 0){
          root = root.getLeftChild();
        }
      }
    }
    return false;
  }
  this.insert = function(node){
    var currNode = this;
    var foundParent = false;
    while(!foundParent){
      if(node.getKey().compareTo(currNode.getKey()) <= 0){
        if(currNode.hasLeft()){
          currNode = currNode.getLeftChild();
        }else{
          currNode.setLeftChild(node);
          foundParent = true;
        }
      }else if(node.getKey().compareTo(currNode.getKey()) > 0){
        if(currNode.hasRight()){
          currNode = currNode.getRightChild();
        }else{
          currNode.setRightChild(node);
          foundParent = true;
        }
      }
    }
    node.setParent(currNode);
    node.splay();
    return node;
  }
  this.delete = function(key){
    var val = this.searchNoSplay(key);
    if(val.getKey().compareTo(key) !== 0){
      val.splay();
      return val;
    }else if(val.hasBoth()){
      var pred = val.findPredecessor();
      val.setKey(pred.getKey());
      if(pred.isRight()){
        pred.getParent().setRightChild(pred.getLeftChild());
      }else if(pred.isLeft()){
        pred.getParent().setLeftChild(pred.getLeftChild());
      }
      if(pred.hasLeft()){
        pred.getLeftChild().setParent(pred.getParent());
      }
      if(!val.hasParent())
        return val;
    }else if(val.hasLeft()){
      if(val.isLeft()){
        val.getParent().setLeftChild(val.getLeftChild());
      }else if(val.isRight()){
        val.getParent().setRightChild(val.getLeftChild());
      }
      val.getLeftChild().setParent(val.getParent());
    }else if(val.hasRight()){
      if(val.isLeft()){
        val.getParent().setLeftChild(val.getRightChild());
      }else if(val.isRight()){
        val.getParent().setRightChild(val.getRightChild());
      }
      val.getRightChild().setParent(val.getParent());
    }else{
      if(val.isRight()){
        val.getParent().setRightChild(null);
      }else if(val.isLeft()){
        val.getParent().setLeftChild(null);
      }else{
        return null;
      }
    }
    if(val.hasParent()){
      var par = val.getParent();
      val.getParent().splay();
      return par;
    }else{
      if(val.hasBoth()){
        return val.getLeftChild();
      }else if (val.hasLeft()){
        return val.getLeftChild();
      }else{
        return val.getRightChild();
      }
    }
  }
  this.findSuccessor = function(){
    if(this.hasRight()){
      return this.getRightChild().findMin();
    }else{
      return this;
    }
  }
  this.findMax = function(){
    var root = this;
    while(root.hasRight()){
      root = root.getRightChild();
    }
    return root;
  }
  this.findMin = function(){
    var root = this;
    while(root.hasLeft()){
      root = root.getLeftChild();
    }
    return root;
  }
  this.findPredecessor = function(){
    if(this.hasLeft()){
      return this.getLeftChild().findMax();
    }else{
      return this;
    }
  }
  this.hasParent = function(){
    return this.getParent() !== null;
  }
  this.hasRight = function(){
    return this.getRightChild() !== null;
  }
  this.hasLeft = function(){
    return this.getLeftChild() !== null;
  }
  this.isRight = function(){
    return this.hasParent() && this.getParent().getRightChild() === this;
  }
  this.isLeft = function(){
    return this.hasParent() && this.getParent().getLeftChild() === this;
  }
  this.hasBoth = function(){
    return this.hasRight() && this.hasLeft();
  }
  this.splay = function(){
    while(this.hasParent()){
      if(this.hasParent() && !this.getParent().hasParent()){
        if(this.isLeft()){
          this.rightRotation(this.getParent());
        }else if(this.isRight()){
          this.leftRotation(this.getParent());
        }
      }else if(this.hasParent()){
        if((this.getParent().isLeft() ||  this.isLeft()) && !(this.getParent().isLeft() && this.isLeft())){
          if(this.isLeft()){
            this.rightRotation(this.getParent());
            this.leftRotation(this.getParent());
          }else if(this.isRight()){
            this.leftRotation(this.getParent());
            this.rightRotation(this.getParent());
          }
        }else{
          if(this.isLeft()){
            this.rightRotation(this.getParent().getParent());
            this.rightRotation(this.getParent());
          }else if(this.isRight()){
            this.leftRotation(this.getParent().getParent());
            this.leftRotation(this.getParent());
          }
        }
      }
    }
  }
  this.rightRotation = function(p){
    var gp = p.getParent();
    var x = p.getLeftChild();
    var B = x.getRightChild();
    if(B){
      B.setParent(p);
    }
    p.setLeftChild(B);
    x.setParent(gp);
    if(gp){
      if(p.isRight()){
        gp.setRightChild(x);
      }else if(p.isLeft()){
        gp.setLeftChild(x);
      }
    }
    x.setRightChild(p);
    p.setParent(x);
  }
  this.leftRotation = function(p){
    var gp = p.getParent();
    var x = p.getRightChild();
    var B = x.getLeftChild();
    if(B){
      B.setParent(p);
    }
    p.setRightChild(B);
    x.setParent(gp);
    if(gp){
      if(p.isRight()){
        gp.setRightChild(x);
      }else if(p.isLeft()){
        gp.setLeftChild(x);
      }
    }
    p.setParent(x);
    x.setLeftChild(p);
  }

  this.getKey = function(){
    return this.key;
  }
  this.setKey = function(key){
    this.key = key;
  }
  this.getParent = function(){
    return this.parent;
  }
  this.setParent = function(parent){
    this.parent = parent;
  }
  this.getLeftChild = function(){
    return this.leftChild;
  }
  this.setLeftChild = function(leftChild){
    this.leftChild = leftChild;
  }
  this.getRightChild = function(){
    return this.rightChild;
  }
  this.setRightChild = function(rightChild){
    this.rightChild = rightChild;
  }
  this.toTreeString = function(){
    var str = "";
    if(this.hasLeft()){
      str += "(" + this.getLeftChild().toTreeString() + ")";
    }
    str += this.getKey().toString();
    if(this.hasRight()){
      str += "(" + this.getRightChild().toTreeString() + ")";
    }
    return str;
  }
}

var SplayTree = function SplayTree(){
  this.root = null;
  this.insert = function(key){
    if(this.root){
      this.root = this.root.insert(new SplayNode(key));
    }else{
      this.root = new SplayNode(key);
    }
  }
  this.delete = function(key){
    if(this.root && key)
      this.root = this.root.delete(key);
  }
  this.search = function(key){
    if(this.root){
      this.root = this.root.search(key);
      return this.root.getKey();
    }else {return null;}
  }
  this.contains = function(key){
    return this.root && this.root.contains(key);
  }
  this.getRoot = function(){
    return this.root;
  }
}
