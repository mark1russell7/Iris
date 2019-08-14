let areas = {};
let size = 100;
let cur;

let addArea = function (name, s) {
  let area = new Area(s || size);
  areas[name] = area;
  return area;
};

let gotoArea = function (name) {
  if(cur) {
    scene.remove(cur.Base);
    toggles(cur);
  }
  cur = areas[name];
  scene.add(areas[name].Base);
  toggles(cur);
};

let toggles = (area) =>{
  area['Grid toggle']();
  // area['Axes toggle']();
  // area['Boundary toggle']();
};


function Area(size) {
  this['Base'] = new THREE.Group();
  toggleAbleMesh({
    host : this,
    name : 'Axes',
    default_param : Math.round((size)/3),
    construct : (w) => new THREE.AxesHelper(w)
  });
  toggleAbleMesh({
    host : this,
    name : 'Grid',
    default_param : size,
    construct : (w) => {
      // let mesh = new THREE.GridHelper(w, w/20);
      // mesh.material.opacity = 0.25;
      // mesh.material.transparent = true;
      let mesh = m(
        spherex({radius : w/2}),
        mbm({
          // wireframe:  true,
          opacity : .2,
          transparent : true,
          depthTest : false,
          depthWrite : false,
          widthSegments : 10,
          heightSegments : 10
        })
      )
      return mesh;
    }
  });
  // toggleAbleMesh({
  //   host : this,
  //   name : 'Boundary',
  //   default_param : size,
  //   construct : (w) => m(
  //     spherex({radius : w/2}),
  //     mbm({
  //       // wireframe : true,
  //       opacity : 0.2,
  //       transparent : true,
  //       depthWrite : false,
  //       depthTest : false
  //     })
  //   )
  // });

}
