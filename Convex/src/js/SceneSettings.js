
let cubesize = 500;
let NUM_EXAMPLES = 4;
let boundary_size = cubesize / 10;
let rounded_side = Math.ceil(Math.sqrt(NUM_EXAMPLES));
let area_size = (rounded_side + 2) * (boundary_size  + cubesize) - boundary_size;
let cub = cubesize;
let bou = boundary_size;
let cube_placer = (base, cubesize=cub, boundary_size=bou) => {
  let dir = 0;
  let cur = vec(0,0,0);
  let map = (() => dir % 2 === 0 ? 'y' : 'x');
  let sign = (() => dir > 1 ? -1 : 1);
  // 0 = North;
  // 1 = East;
  // 2 = South;
  // 3 = West;
  let amount = 1;
  let done = 0;
  let cap = 1;
  let already = false;
  let per = cubesize + boundary_size;
  return (cube) => {
    base.add(cube);
    cur[map()] += per * sign();
    cube.position.set(cur.x,cur.y,cur.z);
    done++;
    if(done === cap) {
      dir = (dir + 1) % 4;
      done = 0;
      if(already) {
        amount++;
      }
      already = !already;
      cap = amount;
    }
  }
};

let toggleAbleMesh = function (w) {
  w.host[w.name] = {
    mesh : w.construct(w.default_param),
    activated : false
  };
  w.host[w.name + " toggle"] = (new_param) => {
    let proxy = w.host[w.name];
    if(new_param){
      if(proxy.activated)
        w.host.Base.remove(proxy.mesh);
      proxy.mesh = w.construct(new_param);
    }
    if(proxy.activated)
      w.host.Base.remove(proxy.mesh);
    else
      w.host.Base.add(proxy.mesh);
    proxy.activated = !proxy.activated;
  }
};


function LinearConstraint(w) {
  Area.call(this, w.size);
  this.normal = w.normal;
  this.centroid = w.centroid;
  this.size = w.size;
  this.mat = w.mat || mbm({color : 'grey', transparent : true, opacity: .2, side : THREE.DoubleSide});
  let self = this;
  toggleAbleMesh({
    host : this,
    name : 'Plane',
    default_param : w,
    construct : (w) => visualplane(hyperplane(self.normal, self.centroid), self.size, self.mat)
  });
}


function hyperplane(normal, centroid){
  let plane = new THREE.Plane();
  plane.setFromNormalAndCoplanarPoint(normal, centroid).normalize();
  return plane;
}

function visualplane(plane, size, mat) {
  let geo = new THREE.PlaneBufferGeometry(size, size);
  let point = new THREE.Vector3(0,0,0);
  plane.coplanarPoint(point);

  let focalPoint = new THREE.Vector3().copy(point).add(plane.normal);
  geo.lookAt(focalPoint);
  geo.translate(point.x, point.y, point.z);

  return m(geo, mat);
}

function LinearConstraints(w){
  Area.call(this, w.size);
  this.size = w.size;
  this.addConstraint = function(o){
    let co = new LinearConstraint({normal : o.normal, centroid : o.centroid, size : o.size || this.size});
    this.Base.add(co.Base);
    co['Plane toggle']();
  }
}

function LinearOptimization(w){
  Area.call(this, w.size);
  this['Constraints'] = new LinearConstraints({size : w.size});
  this.Base.add(this.Constraints.Base);
  this.addConstraint = function (w) {
    this['Constraints'].addConstraint(w);
  };
  toggleAbleMesh({
    host : this,
    name : 'Objective',
    default_param : w,
    construct : (w) => w.objective
  });

}










let master_placer;

let linopt;

camera_seq.then((done) => {

  // let area = new Area(2000);
  // scene.add(area.Base);
  // area['Grid toggle']();
  // area['Axes toggle']();
  // area['Boundary toggle']();

  // let co = new LinearConstraint({normal : new THREE.Vector3(0,1,0), centroid : new THREE.Vector3(0,0,0), size : 100});
  // scene.add(co.Base);
  // co['Plane toggle']();

  // let cos = new LinearConstraints({size : 100});
  // cos.addConstraint({normal : new THREE.Vector3(0,1,0), centroid : new THREE.Vector3(0,0,0)});
  // cos.addConstraint({normal : new THREE.Vector3(1,1,0), centroid : new THREE.Vector3(0,0,0)});
  // scene.add(cos.Base);

  // let con = cone({});
  // con.scale.multiplyScalar(10);
  // let linopt = new LinearOptimization({size : 30, objective : con});
  // linopt.addConstraint({normal : new THREE.Vector3(0,1,0), centroid : new THREE.Vector3(0,0,0)});
  // linopt.addConstraint({normal : new THREE.Vector3(1,1,0), centroid : new THREE.Vector3(0,0,0)});
  // for(let index = 0; index < 3; index++){
  //   linopt.addConstraint({normal : new THREE.Vector3(Math.random(),Math.random(),Math.random()), centroid : new THREE.Vector3(0,0,0)});
  // }
  // scene.add(linopt.Base);
  // linopt['Objective toggle']();
  // linopt.Base.position.x += 1000;


  let area = new Area(2000);
  scene.add(area.Base);
  toggles(area);
  master_placer = cube_placer(area.Base, 2000, 200);





  // let con = cone({radius : 10});
  // con.scale.multiplyScalar(10);

  let con = visualplane(hyperplane(vec(-1, -2, -3), vec(0,0,0)),200, msm({color : 'green',side : THREE.DoubleSide}));
  linopt = new LinearOptimization({size : 500, objective : con});
  // linopt.addConstraint({normal : new THREE.Vector3(0,1,0), centroid : new THREE.Vector3(0,0,0)});
  // linopt.addConstraint({normal : new THREE.Vector3(1,1,0), centroid : new THREE.Vector3(0,0,0)});
  // for(let index = 0; index < 3; index++){
  //   linopt.addConstraint({normal : new THREE.Vector3(Math.random(),Math.random(),Math.random()), centroid : new THREE.Vector3(0,0,0)});
  // }
  linopt['Objective toggle']();
  let lin_placer = cube_placer(linopt.Base, 2000, 200);
  area.Base.add(linopt.Base);


  let but = add_button(2000, 2000/10, area, () => set_and_focus(area.Base.position, vec(0,0,cameraZ)), 'blue');

  camera.add(but);

  but.scale.multiplyScalar(1/22.5);
  but.position.x = 8;
  but.position.y = -5;
  but.position.z = -10;

  done();
});









