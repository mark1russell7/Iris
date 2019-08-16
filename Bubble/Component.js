const default_component_position = new THREE.Vector3(0,0,0);
const default_component_rotation = new THREE.Vector3(0,0,0);
const default_component_loaded = false;
const default_component_hold = false;
function Component(options){
  this.init = function(options){
    options.component = this;
    this.position = options.position ? options.position : default_component_position;
    this.rotation = options.rotation ? options.rotation : default_component_rotation;
    this.loaded = options.loaded ? options.loaded : default_component_loaded;
    this.hold = options.hold ? options.hold : default_component_hold;
    this.metadata = options.metadata ? options.metadata : new Metadata(options);
    this.children = new LinkedList();
    this.modified = options.modified ? options.modified : true;
  }
  this.inherit = function(options){
    options.component = this;
    options.child = this;
    if(options.parent){
      this.parent = options.parent;
      options.parent.addChild(options);
    }
    return options;
  }
  this.addChild = function(options){
    options.component = this.getComponent(options).component;
    this.getChildren(options).children.addLast(options.child);
    options.modified = true;
    this.setModified(options);
    return options;
  }
  this.removeChild = function(options){
    options.component = this.getComponent(options).component;
    this.getChildren(options).children.remove(options.child);
    options.modified = true;
    this.setModified(options);
    return options;
  }
  this.setHold = function(options){
    options.component = this.getComponent(options).component;
    this.hold = options.hold ? options.hold : this.getHold(options).hold;
    return options;
  }
  this.setPosition = function(options){
    options.component = this.getComponent(options).component;
    this.position = options.position ? options.position : this.getPosition(options).position;
    options.modified = true;
    this.setModified(options);
    return options;
  }
  this.setRotation = function(options){
    options.component = this.getComponent(options).component;
    this.rotation = options.rotation ? options.rotation : this.getRotation(options).rotation;
    options.modified = true;
    this.setModified(options);
    return options;
  }
  this.getParent = function(options){
    options.component = this.getComponent(options).component;
    options.parent = this.parent;
    return options;
  }
  this.setLoaded = function(options){
    options.component = this.getComponent(options).component;
    this.loaded = options.loaded;
    return options;
  }
  this.setMetadata = function(options){
    options.component = this.getComponent(options).component;
    this.metadata = options.metadata ? options.metadata : this.getMetadata(options).metadata;
    options.modified = true;
    this.setModified(options);
    return options
  }
  this.setChildren = function(options){
    options.component = this.getComponent(options).component;
    this.children = options.children ? options.children : this.getChildren(options).children;
    return options;
  }
  this.setModified = function(options){
    options.component = this.getComponent(options).component;
    this.modified = options.modified;
    return options;
  }
  this.getLoaded = function(options){
    options.component = this.getComponent(options).component;
    options.loaded = this.loaded;
    return options;
  }
  this.getHold = function(options){
    options.component = this.getComponent(options).component;
    options.hold = this.hold;
    return options;
  }
  this.getPosition = function(options){
    options.component = this.getComponent(options).component;
    options.position = this.position;
    return options;
  }
  this.getRotation = function(options){
    options.component = this.getComponent(options).component;
    options.rotation = this.rotation;
    return options;
  }
  this.getMetadata = function(options){
    options.component = this.getComponent(options).component;
    options.metadata = this.metadata;
    return options;
  }
  this.getChildren = function(options){
    options.component = this.getComponent(options).component;
    options.children = this.children;
    return options;
  }
  this.getModified = function(options){
    options.component = this.getComponent(options).component;
    options.modified = this.modified;
    return options;
  }
  this.getComponent = function(options){
    options.component = this.component;
    return options;
  }
  this.init(options);
  this.inherit(options);
}
