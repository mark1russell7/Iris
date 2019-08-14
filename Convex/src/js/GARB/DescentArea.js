let dd = addArea('Descent');




function Descent(w) {
  Area.call(this, w.size);
  this.optimalCheck = w.optimalCheck;
  this.gradient = w.gradient;
  this.fxn = w.fxn;

  this.visit = w.visit;

  this.direction = w.direction;

  this.distance = w.distance;

  this.comp = w.comp || ((w) => vec(w.x.x + w.dir.x*w.t,w.x.y + w.dir.y*w.t,w.x.z + w.dir.z*w.t));

  this.descend = function(w) {
    w.comp = this.comp;
    if(!this.optimalCheck(w)){
      w.dir = this.direction(w);
      w.t = this.distance(w);
      w.v = this.comp(w);
      this.visit(w);
      if(this.fxn(w.v) <= this.fxn(w.x))
        return this.descend({...w, x : w.v});
      return w.v;
    }
  }
}

function NewtonsMethod(w) {
  Descent.call(this, w);
  this.optimalCheck = function (w) {
    return !w.gradient(w.x).dot(w.second(w.x)(w.gradient(w.x)))/2 > w.epsilon;
  };
  this.direction = function (w) {
    return w.second(w.x)(vec(-w.gradient(w.x).x, -w.gradient(w.x).y, -w.gradient(w.x).z));
  };

}
// distance, visit, fxn, gradient
function GradientDescent(w) {
  Descent.call(this, w);
  this.optimalCheck = function (w) {
    return this.gradient(w.x) === 0;
  };
  this.direction = function (w) {
    let v = this.gradient(w.x);
    v.normalize();
    return vec(-v.x,-v.y,-v.z);
  };
}

// camera_seq.then(
//   (done) => {
//     let pack = {
//       distance : () => 1/2,
//       fxn : (v) => v.x**2 + v.y**2,
//       gradient : (v) => vec(2 * v.x, 2 * v.y, -1),
//       alpha : .1,
//       beta : .7,
//       comp : (w) => {
//         let v = w.x.clone();
//         v.add(w.dir);
//         v.multiplyScalar(1/2);
//         return v;
//       },
//       visit : (w) => {
//       },
//       x : vec(-3, 5, 0),
//       second : (v) => () => vec(v.x/2,v.y/2,0),
//       epsilon : .1
//     };
//     pack.visit = AnimatedDescent({...pack, color : 'blue'});
//     let nn = new NewtonsMethod(pack);
//     nn.descend(pack);
//
//
//
//     let r = 8;
//     let surf = parametric({
//       f : (u, v, vec) => {
//         vec.x = r*u * Math.cos(v * Math.PI*2);
//         vec.y = (r*u)**2;
//         vec.z = r*u * Math.sin(v * Math.PI*2);
//       },
//       s1 : 100,
//       s2 : 100,
//       mat : msm( { color: 0x00ff00, side : THREE.DoubleSide, transparent : true, opacity : .7 } )
//     });
//     scene.add(surf);
//
//
//     let pack2 = {
//       distance : () => 1/2,
//       fxn : (v) => v.x**2 + v.y**2,
//       gradient : (v) => vec(2 * v.x, 2 * v.y, 0),
//       alpha : .1,
//       beta : .7,
//       visit : (w) => {
//         console.log(w.v, w.fxn(w.v));
//       },
//       x : vec(5, 5, 0),
//       speed : 300
//     };
//     pack2.visit = AnimatedDescent(pack2);
//     let gd = new GradientDescent(pack2);
//
//     gd.descend(pack2);
//
//     done();
//   }
// )



// function newt(w) {
//   while(w.gradient(w.x).dot(w.second(w.x)(w.gradient(w.x)))/2 > w.epsilon){
//     w.nt = w.second(w.x)(vec(-w.gradient(w.x).x, -w.gradient(w.x).y, -w.gradient(w.x).z));
//     w.dir = w.nt;
//     // compute t by backtracking line search
//     // w.t = 1;
//     // while(!(w.fxn(w.x) - w.fxn(w.comp(w))>= w.t * 1/2)){
//     //   w.t *= 1/2;
//     // }
//     //
//     w.t = 1/2;
//     w.x.add(w.nt);
//     w.x.multiplyScalar(w.t);
//     w.v = w.x;
//     w.visit(w);
//   }

// }


function AnimatedDescent(w) {
  let points = [];
  let chain = ASQ();
  let line;
  let mat = new THREE.LineBasicMaterial({
    color: w.color || 0xff0000
  });
  let total = 0;
  let cur = 0;
  return (o) => {
    total++;
    chain.then(
      (done) => {
        setTimeout(() => {
          cur++;
          points.push(vec(o.x.x, o.fxn(o.x), o.x.y));
          let geo = new THREE.Geometry();
          geo.vertices.push(...points);
          if(line)
            scene.remove(line);
          line = new THREE.Line(geo, mat);
          scene.add(line);
          let curTemp = 0;
          console.log(cur);
          points.forEach(p => {
            let point = m(sphere(.1* (1 - curTemp/total)), mbm({color : 'white'}));
            line.add(point);
            point.position.set(p.x,p.y,p.z);
            console.log(curTemp)
            curTemp++;
            var planeGeo = new THREE.PlaneGeometry(2 * (1 - curTemp/total), 2 * (1 - curTemp/total));

            let planeMat = msm({color : 'purple', transparent : true, opacity : .5, side : THREE.DoubleSide});
            let Plane = new THREE.Mesh(planeGeo, planeMat);
            line.add(Plane);
            Plane.position.set(0,0,0);
            Plane.lookAt(2*p.x, -1, 2*p.z);
            Plane.position.set(p.x,p.y,p.z);

          });
          if(cur > 25)
            done.fail("failed");
          done();
        }, w.speed || 100)
      }
    )
  };

}




