let options = {
  line_search : 'back', // 'back' or 'newton'
  alpha : .1,
  beta : .7,
  epsilon : .1,
  precision : .0001,
  point : undefined,    // vec(a,b,c)
};

let make_button = (position, color, text, cont) => {
  let button = m(
    spherex({radius : 15, widthSegments : 30, heightSegments : 30}),
    msm({color : color})
  );
  button.position.set(position.x,position.y,position.z);


  let length = 30*2;
  let width = 15*2;
  let plate_geo = new THREE.PlaneBufferGeometry(length,width);
  let canvas = document.createElement('canvas');

  canvas.height = 256;
  canvas.width = 256*2;

  let context = canvas.getContext('2d');
  context.font = 128  + "px sans-serif";
  context.fillStyle = 'black';
  context.textBaseline = 'top';
  context.textAlign = 'left';
  // context.rotate(0);
  context.translate(0,0);

  context.fillText(text,0,0);

  let plate_mat = mbm({
    map : new THREE.Texture(canvas),
    transparent : true,
    side : THREE.DoubleSide
    // depthTest : false
  });

  plate_mat.map.needsUpdate = true;

  let plate = m(plate_geo, plate_mat);

  button.add(plate);

  plate.position.set(15, 15, 0);


  left_click.push((e) => {
    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(
      (e.x / window.innerWidth) * 2 - 1,
      -(e.y / window.innerHeight) * 2 + 1
    ), camera);
    let insect = raycaster.intersectObject(button, false);
    if(insect[0]){
      cont();
    }
  });
  return button;
};

camera_seq.then((done) => {

  let base = new THREE.Group();

  let spacing = 70;
  let positions = [
    vec(0,0,0),
    vec(spacing,0,0),
    vec(spacing*2,0,0),
    vec(0,-spacing,0),
    vec(spacing,-spacing,0),
    vec(spacing*2,-spacing,0),
    vec(0,-spacing*2,0),
    vec(spacing,-spacing*2,0),
    vec(spacing*2,-spacing*2,0),
    vec(0,-spacing*3,0),
    vec(spacing,-spacing*3,0),
  ];
  let show_newtonb = make_button(positions[7], 'blue', 'newt-dir', () => show_newton = !show_newton);
  let show_gradb = make_button(positions[8], 'blue', 'grad-dir', () => show_grad = !show_grad);
  let show_quadb = make_button(positions[9], 'blue', 'quadratic', () => show_quad = !show_quad);
  let show_tangb = make_button(positions[10], 'blue', 'tan plane', () => show_tang = !show_tang);


  let backtracking = make_button(positions[0], 'blue', 'backtrack', () => options.line_search = 'back');
  let newton = make_button(positions[1], 'blue', 'newton', () => options.line_search = 'newton');


  let writable = (text, pos, parse=(x) => x) => {
    let store = "";
    let active = false;
    let listener;
    return  make_button(pos, 'blue', text, () => {
      if(active){
        window.removeEventListener('keypress', listener, true);
        options[text] = parse(Number(store));
      }else{
        listener = (e) => {
          if(!isNaN(Number(e.key)))
            store += e.key;
        };
        active = true;
        window.addEventListener('keypress', listener, true);
      }
    });
  };

  let alpha = writable('alpha', positions[2], (x) => x / Math.pow(10, Math.ceil(Math.log10(x))));
  let beta = writable('beta', positions[3], (x) => x / Math.pow(10, Math.ceil(Math.log10(x))));
  let epsilon = writable('epsilon', positions[4]);
  let precision = writable('precision', positions[5]);


  let store = vec(0,0,0);
  let listener;
  let num = 0;
  let point = make_button(positions[6], 'blue', 'point', () => {

    listener = (e) => {
      if(!isNaN(Number(e.key))){
        switch (num) {
          case 0 :
            store.x = Number(e.key);
            break;
          case 1 :
            store.y = Number(e.key);
            break;
          case 2 :
            store.z = Number(e.key);
            break;

        }
        num++;
        if(num > 2) {
          options['point'] = store;
          window.removeEventListener('keypress', listener, true);
        }
      }

    };
    window.addEventListener('keypress', listener, true);
  });


  base.add(backtracking);
  base.add(newton);
  base.add(beta);
  base.add(alpha);
  base.add(precision);
  base.add(epsilon);
  base.add(point);


  base.add(show_gradb);
  base.add(show_newtonb);
  base.add(show_quadb);
  base.add(show_tangb);

  camera.add(base);
  base.scale.multiplyScalar(1/15);
  base.position.z = -50;
  base.position.x = 50;
  base.position.y = 0;

  done();
});


