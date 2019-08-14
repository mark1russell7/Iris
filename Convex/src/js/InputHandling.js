let right_click = [],
  left_click = [],
  right_drag = [],
  left_drag = [],
  right_up = [],
  left_up = [],
  wheel = [],
  dbl_click = [],
  mouse_move = [];

// let plane = (width, height) => new THREE.PlaneBufferGeometry(width, height);
let mouse_position = new THREE.Vector2(0,0);
let set_mouse_position = function (e) {
  mouse_position.x = (e.x / window.innerWidth) * 2 - 1;
  mouse_position.y = -(e.y / window.innerHeight) * 2 + 1;
}
let check_button = (e) => ("which" in e) ? e.which === 3 : ("button" in e ? e.button === 2 : false);
let flag = 0;
let onMouseDown = function (e) {
  set_mouse_position(e);
  if (check_button(e))
    onRightClick(e);
  else
    onLeftClick(e);
};
let onMouseMove = function (e) {
  if (flag === 1) {
    if (check_button(e))
      onRightDrag(e);
    else
      onLeftDrag(e);
  } else
    for (let fxn of mouse_move)
      fxn(e);
};
let onMouseUp = (e) => {flag = 0; check_button(e) ? onRightUp(e) : onLeftUp(e)};
let onRightClick = function (e) {flag = 1;for (let fxn of right_click) fxn(e);};
let onLeftClick = function (e) {flag = 1;for (let fxn of left_click) fxn(e);};
let onRightUp = function (e) {flag = 0;for (let fxn of right_up) fxn(e);};
let onLeftUp = function (e) {flag = 0;for (let fxn of left_up) fxn(e);};
let onRightDrag = function (e) {for (let fxn of right_drag) fxn(e);};
let onLeftDrag = function (e) {for (let fxn of left_drag) fxn(e);};
let onWheel = function (e) {for (let fxn of wheel) fxn(e);};
let onDblClick = function (e) {for (let fxn of dbl_click) fxn(e);};
window.addEventListener("mousedown", onMouseDown, {passive : true});
window.addEventListener("mousemove", onMouseMove, {passive : true});
window.addEventListener("mouseup", onMouseUp, {passive : true});
window.addEventListener("wheel", onWheel, {passive : true});
window.addEventListener("dblclick", onDblClick, {passive : true});



let on_camera_move = [];

let onCameraMoved = function(w){on_camera_move.forEach(fxn => fxn(w));}

right_drag.push(onCameraMoved);
left_drag.push(onCameraMoved);

camera_seq.then((done) => {

  var plane = (width, height) => new THREE.PlaneBufferGeometry(width, height);


  let mouse_capture_size = 1000;

  let mouse_capture_mesh = new THREE.Mesh(
    plane(mouse_capture_size, mouse_capture_size),
    msm({transparent: true, opacity: 0, depthTest: false, depthWrite: false}));

  mouse_capture_mesh.position.set(0, 0, -425);
  mouse_capture_mesh.material.side = THREE.DoubleSide;
  mouse_capture_mesh.doubleSided = true;
  camera.add(mouse_capture_mesh);

  let move_orbit = function (e) {
    controls.enablePan = false;
    vr_controls.enablePan = false;

    let nextX = (e.x / window.innerWidth) * 2 - 1;
    let nextY = -(e.y / window.innerHeight) * 2 + 1;

    let raycaster = new THREE.Raycaster();
    let raycaster2 = new THREE.Raycaster();

    raycaster.setFromCamera(mouse_position, camera);
    raycaster2.setFromCamera(new THREE.Vector2(nextX, nextY), camera);

    let vector_before = new THREE.Vector3(0, 0, 0);
    let vector_after = new THREE.Vector3(0, 0, 0);

    let intersect_before = raycaster.intersectObject(mouse_capture_mesh, true);
    let intersect_after = raycaster2.intersectObject(mouse_capture_mesh, true);

    if (intersect_before[0] !== undefined && intersect_after[0] !== undefined) {
      raycaster.ray.at(intersect_before[0].distance, vector_before);
      raycaster2.ray.at(intersect_after[0].distance, vector_after);

      let travel_distance = new THREE.Vector3(vector_before.x - vector_after.x, vector_before.y - vector_after.y, vector_before.z - vector_after.z);

      camera.position.addScaledVector(travel_distance, controls.panSpeed);
      controls.target.addScaledVector(travel_distance, controls.panSpeed);

      mouse_position.x = nextX;
      mouse_position.y = nextY;
    }
  };
  // controls.panSpeed = .25;
  // controls.zoomSpeed = 1;


  right_drag.push(move_orbit);

  wheel.push(function (e) {
    // if mouse is not intersecting anything
    if(!controls.enableZoom) {
      let vector = new THREE.Vector3(0, 0, e.deltaY / 5).applyQuaternion(camera.quaternion);
      camera.position.addScaledVector(vector, controls.zoomSpeed);
      controls.target.addScaledVector(vector, controls.zoomSpeed);
    }
  })
  controls.enableZoom = false;


  controls.rotateSpeed = 0.4;
  done();
});
