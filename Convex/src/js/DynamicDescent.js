let ddd = addArea('DynamicDescent');

let show_newton = true;
let show_grad = true;
let show_quad = true;
let show_tang = true;

// Abstract -- implement optimalcheck, direction, distance, search, fxn and visit to run descent on fxn
function DynamicDescent(w){
  Area.call(this, w.size);
  this.optimalCheck = w.optimalCheck;
  this.gradient = w.gradient;
  this.fxn = w.fxn;
  this.search = w.search;
  this.visit = w.visit;

  w.x = dod(options, 'point', w.x);

  this.direction = w.direction;

  this.lineWidth = w.lineWidth;

  this.distance = w.distance;

  this.comp = w.comp || ((w) => vec(w.x.x + w.dir.x*w.t,w.x.y + w.dir.y*w.t,w.x.z + w.dir.z*w.t));

  this.variables = w.variables;

  this.va = function(v) {
    return {
      x : v[0],
      y : v[1],
      z : v[2]
    }
  };
  this.vs = function(v) {
    return [v.x,v.y,v.z]
  };

  let first = true;
  this.descend = function(w) {
    if(first) w.x = dod(options, 'point', w.x); // dynamic on user-defined starting point
    first = true;
    w.comp = this.comp;
    if(!this.optimalCheck(w)){  // dynamic on optimalCheck
      w.dir = this.direction(w); // dynamic on direction...
      if(options.line_search === 'newton'){
        w.v = newtons_line_search(w);
      }else{
        if(options.line_search === 'back')
          w.t = backtracking_line_search({
            ...w,
            alpha : .5,
            beta : .5
          });
        else
          w.t = 1/2;
        w.v = this.comp(w);
      }
      this.visit(w);
      // if we are improving, continue, else return current value
      if(evaluate(this.fxn, this.va(this.vs(w.v))) <= evaluate(this.fxn, this.va(this.vs(w.x)))) {
        first = false;
        return this.descend({...w, x: w.v});
      }
      return w.v;
    }else{
      this.visit(w);
      return w.v;
    }
  }
}

// Steepest descent
function DynamicGradientDescent(w) {
  DynamicDescent.call(this, w);
  this.optimalCheck = function (w) {
    return evaluate(this.gradient, this.va(this.vs(w.x))).every(e => Math.abs(e) <= options.precision);
  };
  this.direction = function (w) {
    return vec(...evaluate(this.gradient, this.va(this.vs(w.x)))).normalize().multiplyScalar(-1);
  };
}

// Newtons Method for descent
function DynamicNewtonsMethod(w) {
  DynamicDescent.call(this, w);
  this.optimalCheck = function (w) {
    let firstx = evaluate(w.gradient, this.va(this.vs(w.x)));
    let secondx = evaluate(w.gradient.map(fi => gradient(fi, ['x','y','z'])), this.va(this.vs(w.x)));
    let applied = matrix(secondx, firstx);
    let dot = 0;
    for(let i = 0, k = firstx.length; i < k; ++i)
      dot += firstx[i] * applied[i];
    return !(dot/2 > options.epsilon);
  };
  this.direction = function (w) {
    return vec(
      ...matrix(
        evaluate(w.gradient.map(fi => gradient(fi, ['x','y','z'])), this.va(this.vs(w.x))),
        evaluate(w.gradient, this.va(this.vs(w.x))).map(e => -e)
      )
    ).normalize();
  };

}

// Animates the descent trace
function DynamicAnimatedDescent(w) {
  let points = [], chain = ASQ(), tim, line, total = 0, cur = 0;
  w.parent.Animation = chain;
  w.parent.resetAnimation = () => {
    w.parent.Base.remove(line);
    clearTimeout(tim);
    chain.then((done) => {
      done.fail("failed");
    });
    line = undefined;
    points = [];
    chain = ASQ();
    total = 0;
    cur = 0;
  };
  return (o) => {
    total++;
    chain.then(
      (done) => {
        tim = setTimeout(() => {
          let mat = new MeshLineMaterial({
            color: w.color || 0xff0000,
            lineWidth : w.lineWidth !== undefined ? w.lineWidth : .05
          });
          cur++;
          points.push(vec(o.x.x, evaluate(o.fxn, [o.x.x,o.x.y,o.x.z]), o.x.y));
          let geo = new THREE.Geometry();
          geo.vertices.push(...points);
          if(line)
            w.parent.Base.remove(line);
          // line = new THREE.Line(geo, mat);

          // Draw lines between the points at each descent step
          line = new MeshLine();
          line.setGeometry(geo);
          line = m(line.geometry, mat);
          w.parent.Base.add(line);
          let curTemp = 0;
          let lastp;
          points.forEach(p => {
            lastp = p;
            let point = m(sphere(.1* (1 - curTemp/total)), mbm({color : 'white'}));
            line.add(point);
            point.position.set(p.x,p.y,p.z);
            curTemp++;
            let pfact = 4;

            // draw tangent plane to current point
            if(show_tang) {
              var planeGeo = new THREE.PlaneGeometry(pfact * (1 - curTemp / total), pfact * (1 - curTemp / total));

              let planeMat = msm({color: 'purple', transparent: true, opacity: .5, side: THREE.DoubleSide});
              let Plane = new THREE.Mesh(planeGeo, planeMat);
              line.add(Plane);
              Plane.position.set(0, 0, 0);

              let ev = evaluate(w.gradient, {
                x: p.x,
                y: p.z,
                z: p.y
              });

              let temp = ev[1];
              ev[1] = ev[2];
              ev[2] = temp;

              ev[1] = -1;
              p.y = evaluate(w.fxn, {
                x: p.x,
                y: p.z,
                z: p.y
              });

              let pos = vec(0, 0, 0);
              w.parent.Base.getWorldPosition(pos);

              Plane.lookAt(ev[0] + pos.x, ev[1] + pos.y, ev[2] + pos.z);
              Plane.position.set(p.x, p.y, p.z);
            }

            // draw gradient vector at current point
            if(show_grad) {

              let ev2 = evaluate(w.gradient, {
                x : p.x,
                y : p.y,
                z : p.z
              });
              let grad_dir = vec(...ev2);
              let line_grad = new MeshLine();
              let grad_geo = new THREE.Geometry();
              grad_geo.vertices.push(vec(0, 0, 0));
              grad_geo.vertices.push(grad_dir.normalize().multiplyScalar(-10));
              line_grad.setGeometry(grad_geo);
              point.add(m(line_grad.geometry, new MeshLineMaterial({
                color: 'red',
                lineWidth: w.lineWidth !== undefined ? w.lineWidth : .05
              })));
            }
            // draw newton step direction vector at the current point
            if(show_newton) {
              let ndir = vec(
                ...matrix(
                  evaluate(w.gradient.map(fi => gradient(fi, ['x', 'y', 'z'])), w.parent.va(w.parent.vs(w.x))),
                  evaluate(w.gradient, w.parent.va(w.parent.vs(w.x))).map(e => -e)
                )
              ).normalize();

              let line_n = new MeshLine();
              let n_geo = new THREE.Geometry();
              n_geo.vertices.push(vec(0, 0, 0));
              n_geo.vertices.push(ndir.multiplyScalar(10));
              line_n.setGeometry(n_geo);
              point.add(m(line_n.geometry, new MeshLineMaterial({
                color: 'purple',
                lineWidth: w.lineWidth !== undefined ? w.lineWidth : .05
              })));
            }
            // draw the quadratic q(y) = f (x) +∇f (x)T(y−x) + (½)(y−x)T∇2f (x)(y−x) for the current point
            if(show_quad) {
              let hessx = evaluate(w.gradient.map(fi => gradient(fi, ['x', 'y', 'z'])), w.parent.va(w.parent.vs(w.x)));
              let gradx = evaluate(w.gradient, w.parent.va(w.parent.vs(w.x)));
              let fx = evaluate(o.fxn, w.parent.va(w.parent.vs(w.x)));


              let dot = (v1, v2) => v1.map((e, i) => e * v2[i]).reduce((a, b) => a + b);
              let subv = (v1, v2) => v1.map((e, i) => e - v2[i]);


              // let q = (y) => fx + dot(gradx, subv(y, w.parent.vs(w.x))) + 1/2 * dot(subv(y, w.parent.vs(w.x)), dot(hessx, subv(y, w.parent.vs(w.x))));

              let q = (y) => fx + dot(gradx, subv(y, w.parent.vs(w.x))) + 1 / 2 * dot(subv(y, w.parent.vs(w.x)), matrix(hessx, subv(y, w.parent.vs(w.x))));


              // console.log(q([1,2,3]));


              let delta = math.lusolve(hessx, gradx.map(e => -e));



              let interpolation_resolution = 20;
              let dist = vec(...delta).normalize().multiplyScalar(-1 / interpolation_resolution);
              let interp_points = [];
              for (let index = 1; index <= interpolation_resolution; ++index) {
                interp_points.push(
                  subv(
                    w.parent.vs(w.x),
                    w.parent.vs(
                      dist.clone().multiplyScalar(index)
                    )
                  ),
                  q(
                    subv(
                      w.parent.vs(w.x),
                      w.parent.vs(
                        dist.clone().multiplyScalar(index)
                      )
                    )
                  ))
              }
              interp_points.forEach((e, i) => {
                if (e instanceof Array) {
                  interp_points[i][2] = interp_points[i][1];
                  interp_points[i][1] = interp_points[i + 1];
                }
              });


              let quadr = new MeshLine();
              let qgeo = new THREE.Geometry();
              qgeo.vertices.push(...interp_points.filter(e => e instanceof Array).map(e => vec(...e)));
              quadr.setGeometry(qgeo);
              let qmesh = m(quadr.geometry, new MeshLineMaterial({
                color: 'black',
                lineWidth: .025
              }));
              point.add(qmesh);
              qmesh.position.set(
                -interp_points[0][0],
                -interp_points[0][1],
                -interp_points[0][2],
              )

            }

          });

          // allows functionality for camera to follow close in on the descent trace
          if(w.parent.follow === true && points.length > 1) {

            let xs = [];
            let ys = [];
            points.forEach(p => {
              xs.push([p.x,p.z]);
              ys.push([p.y]);
            });
            // use lagrangian interpolation to make the camera path nicer
            let int = lagrangian_interpolation({x : xs, y : ys});
            let po = points.length - 1;
            let slope = [
              points[po].x - points[po - 1].x,
              points[po].z - points[po - 1].z
            ];
            slope = [slope[0],int(slope),slope[1]];
            slope = vec(...slope);


            let pos2 = points[po].clone().add(slope.clone().normalize().multiplyScalar(10))

            let pos = vec(0,0,0);
            w.parent.Base.getWorldPosition(pos);
            pos2.add(vec(0,0,cubesize/5));
            set_and_focus(pos, pos2); // lastp.clone().normalize().multiplyScalar(10)
          }
          if(cur > 25)
            done.fail("failed");
          done();
        }, w.speed || 100)
      }
    )
  };

}
let lagrangian_interpolation = (w) => {
  let points = w.x;
  let values = w.y;
  let c = (j) => {
    return (o) => {
      let prod = 1;
      for(let i = 0, pl = points.length; i < pl; ++i){
        if(i === j) continue;
        let top, bot;
        if(points[i].map((e,k) => e - o[k]).every(e => e === 0))
          top = 0;
        else
          top = points[i].map((e,k) => e - o[k]).filter(e=>e!==0).reduce((a,b)=>a*b);

        if(points[i].map((e,k) => e - points[j][k]).every(e => e === 0))
          bot = 0;
        else
          bot = points[i].map((e,k) => e - points[j][k]).filter(e=>e!==0).reduce((a,b)=>a*b);

        prod *= top / bot;
      }
      return prod;
    }
  };
  let y = (x) => {
    let sum = 0;
    for(let i = 0, k = points.length; i < k; ++i) {
      sum += c(i)(x) * values[i];
    }
    return sum;
  };
  return y;
};



let backtracking_line_search = function (w) {
  let t = 1;
  let dir = [w.dir.x,w.dir.y,w.dir.z];
  let v = w.x.clone();
  v.add(w.dir.multiplyScalar(t));

  let fv = () => evaluate(w.fxn, {
    x : w.x.x + t * w.dir.x,
    y : w.x.y + t * w.dir.y,
    z : w.x.z + t * w.dir.z,
  });

  let fx = evaluate(w.fxn, {x : w.x.x, y : w.x.y, z : w.x.z});

  let gx = evaluate(w.gradient, {x : w.x.x, y : w.x.y, z : w.x.z});


  let dot = 0;
  for(let i = 0, k = gx.length; i < k; ++i)
    dot += gx[i] * dir[i];

  while(fv() > fx + options.alpha * t * dot)
    t = options.beta * t;

  return t;
};

let newtons_line_search = function (w) {
  let g = w.gradient;
  let x = [w.x.x,w.x.y,w.x.z];
  let second = g.map(fi => gradient(fi, ['x','y','z']));
  let oldx = w.x;
  while(evaluate(g, {x : x[0], y : x[1], z : x[2]}).some(e => Math.abs(e) >= options.precision)){
    let sx = evaluate(second, {x : x[0], y : x[1], z : x[2]});
    let gx = evaluate(g, {x : x[0], y : x[1], z : x[2]});

    let delta = math.lusolve(sx, gx.map(e => -e));
    x[0] += delta[0][0];
    x[1] += delta[1][0];
    x[2] += delta[2][0];

    w.x = vec(...x);
    w.visit(w)
  }
  w.x = oldx;
  return vec(...x);
};




let example = (w) => {
  let pack  = {
    distance : () => 1/2,
    visit : dod(w, 'visit', (() => {})),
    alpha : dod(w, 'alpha', .1),
    beta : dod(w, 'beta', .7),
    x : dod(w, 'x', vec(5,7,0)),
    speed : dod(w, 'speed', 300),
    variables : ['x','y','z'],
    size : w['size'] || 200,
    epsilon : .1,
    search : 'back',
    precision : .0001,
    lineWidth : .05,
  };
  pack['fxn'] = w['fxn'];
  pack['gradient'] = gradient(w['fxn'], ['x','y','z']);

  let gd = new DynamicGradientDescent(pack);
  pack.parent = gd;
  gd.visit = DynamicAnimatedDescent(pack);


  gd.Base.add(w.visual);
  return [gd, pack];
};


let surfmat = msm( { color: 0x00ff00, side : THREE.DoubleSide, transparent : true, opacity : .7 } );

let gradientDescentExamples = (w) => {
  let examples = [];

  let x = vari('x');
  let y = vari('y');
  let z = vari('z');

  // Example 1
  examples.push((() => {
    let ru = 16;
    let rv = 16;
    let ou = -.2;
    let ov = -.4;
    let surf = parametric({
      f : (u, v, vec) => {
        let fu = (u + ou) * ru;
        let fv = (v + ov) * rv;
        vec.x = fu;
        vec.y = fu**2 - 7*fu + fv**2;
        vec.z = fv;
      },
      s1 : 100,
      s2 : 100,
      mat : surfmat
    });

    let fxn2 = add([
      sub([
        exp([
          x,
          num(2)
        ]),
        mult([
          num(7),
          x
        ])
      ]),
      exp([
        y,
        num(2)
      ])
    ]);
    return example({
      ...w,
      fxn : fxn2,
      visual : surf
    });
  })());
  //

  // Example 2
  examples.push((() => {
    let r = 3;
    let surf = parametric({
      f : (u, v, vec) => {
        vec.x = r*u * Math.cos(v * Math.PI*2);
        vec.y = (r*u)**4;
        vec.z = r*u * Math.sin(v * Math.PI*2);
      },
      s1 : 100,
      s2 : 100,
      mat : surfmat
    });

    let fxn2 = add([
      exp([
        x,
        num(4)
      ]),
      exp([
        y,
        num(4)
      ])
    ]);
    return example({
      ...w,
      fxn : fxn2,
      visual : surf
    })
  })());
  //


  //
  examples.push((() => {
    let ru = 16;
    let rv = 16;
    let ou = -.5;
    let ov = -.5;
    let surf = parametric({
      f : (u, v, vec) => {
        let fu = (u + ou) * ru;
        let fv = (v + ov) * rv;
        vec.x = fu;
        vec.y = fu**2 + fv*fu + fv**2;
        vec.z = fv;
      },
      s1 : 100,
      s2 : 100,
      mat : surfmat
    });

    let fxn2 = add([
      exp([
        x,
        num(2)
      ]),
      add([
        mult([
          x,
          y
        ]),
        exp([
          y,
          num(4)
        ])
      ])
    ]);
    return example({
      ...w,
      fxn : fxn2,
      visual : surf
    })
  })());
  //

  //
  examples.push((() => {
    function CustomSinCurve( scale ) {

      THREE.Curve.call( this );

      this.scale = ( scale === undefined ) ? 1 : scale;

    }

    CustomSinCurve.prototype = Object.create( THREE.Curve.prototype );
    CustomSinCurve.prototype.constructor = CustomSinCurve;

    let fxn = exp([
      x,
      num(2)
    ]);

    let fxn2 = add([
      fxn,
      x
    ]);

    CustomSinCurve.prototype.getPoint = function ( t ) {
      let adj = (x) => (15*(x - .5));
      var tx = adj(t);
      var ty = evaluate(fxn2, {x : (adj(t))});
      var tz = 0;

      return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );

    };

    var path = new CustomSinCurve( 1 );
    var geometry = new THREE.TubeBufferGeometry( path, 200, .25, 30, false );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var surf = new THREE.Mesh( geometry, material );



    return example({
      ...w,
      fxn : fxn2,
      visual : surf
    })
  })());
  //


  function Example(ex, par=DescentArea.Base){
    this.example = ex;
    this.activate = function(par2=DescentArea.Base){
      if(par2 !== par)
        par = par2;
      par.add(this.example[0].Base);
      this.example[0].descend(this.example[1]);
    };
    this.deactivate = function () {
      par.remove(this.example[0].Base);
    }
  }
  return examples.map(e => new Example(e, DescentArea.Base));

};


let set_and_focus = (pos, dist) => {
  camera.position.set(pos.x + dist.x, pos.y + dist.y, pos.z + dist.z);
  controls.target = pos.clone();
};

let descent_setup = (ex, par, cubesize, boundary_size, name) => {
  let area = ex.example[0];
  par.add(area.Base);
  toggles(area);
  add_plate(cubesize,boundary_size,name,area);
  let gradient_descent = add_button(cubesize, boundary_size, area, () => {area.resetAnimation(); ex.activate();}, 'green');
  let p = add_plate(cubesize/5,boundary_size/5,"steepest descent",{Base : gradient_descent});
  p.position.y = 30;
  p.position.z = 0;


  let but = add_button(cubesize, boundary_size, area, () => {
    let s = camera.position.clone();
    let gp = vec(0,0,0);
    area.Base.getWorldPosition(gp);
    camera.position.set(gp.x,gp.y,gp.z + cubesize);
    controls.target.addScaledVector(vec(camera.position.x-s.x,camera.position.y-s.y,camera.position.z-s.z), 1);
  }, 'blue');
  but.position.y -= 70;
  let p2 = add_plate(cubesize/5,boundary_size/5,"focus",{Base : but});
  p2.position.y = 30;
  p2.position.z = 0;


  let butfoll = add_button(cubesize, boundary_size, area, () => area.follow = !area.follow, 'yellow');
  butfoll.position.y += 70;
  let p3 = add_plate(cubesize/5,boundary_size/5,"camera follow",{Base : butfoll});
  p3.position.y = 30;
  p3.position.z = 0;

  // pause and stop button

  let areaold;
  let donebefore = false;
  let gsave;
  let gget = () => {return gsave;};
  let newtbut = add_button(cubesize, boundary_size, area, () => {
    if(areaold)
      areaold.resetAnimation();
    let g = ex.example[1];
    g.color = 'blue';
    let gd = new DynamicNewtonsMethod(g);
    g.parent = gd;
    gd.visit = DynamicAnimatedDescent(g);
    areaold = gd;
    area.Base.add(gd.Base);

    gd.follow = area.follow;
    gsave = gd;
    if(!donebefore) {
      Object.defineProperty(area, 'follow', {
        set: function (x) {
          (gget()).follow = x;
        }
      });
      donebefore = true;
    }
    gd.descend(g);
  }, 'white');
  newtbut.position.y -= 135;
  let p4 = add_plate(cubesize/5,boundary_size/5,"Newtons Method",{Base : newtbut});
  p4.position.y = 30;
  p4.position.z = 0;

  return area;
};

let add_button = (cubesize, boundary_size, area, cont, color) => {
  let button = m(
    spherex({radius : 15, widthSegments : 30, heightSegments : 30}),
    msm({color : color || 'green'})
  );
  area.Base.add(button);
  button.position.set(
    cubesize/2 - boundary_size - 25,
    cubesize/4- boundary_size,
    0
  );
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
let add_plate = (cubesize, boundary_size, name, area) => {
  let plate_geo = new THREE.PlaneBufferGeometry(2*(cubesize - 2 * boundary_size), 2*boundary_size);
  let canvas = document.createElement('canvas');

  let multi = 7;

  canvas.height = boundary_size*multi;
  canvas.width = cubesize*multi;

  let context = canvas.getContext('2d');
  context.font = (boundary_size/50) * 30*multi + "px sans-serif";
  context.fillStyle = 'black';
  context.textBaseline = 'top';
  context.textAlign = 'left';
  // context.rotate(0);
  context.translate(0,0);

  context.fillText(name,0,0);

  let plate_mat = mbm({
    map : new THREE.Texture(canvas),
    transparent : true,
    side : THREE.DoubleSide
    // depthTest : false
  });

  plate_mat.map.needsUpdate = true;

  let plate = m(plate_geo, plate_mat);
  // plate.rotation.y -= Math.PI/2;
  area.Base.add(plate);

  plate.position.set(
    2*(cubesize/2 - boundary_size*2 - ((boundary_size/50) * 30*multi / cubesize*multi) * name.length/2),
    cubesize/2 + boundary_size/2,
    cubesize/3
  );
  return plate;
};


