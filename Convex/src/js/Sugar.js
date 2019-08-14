// THREE.js Sugar Constructors
  let msm     = (w) => new THREE.MeshStandardMaterial(w);
  let mbm     = (w) => new THREE.MeshBasicMaterial(w);
  let sphere  = (r) => new THREE.SphereBufferGeometry(r);
  let spherex = (w) => new THREE.SphereBufferGeometry(
    w.radius,
    w.widthSegments   || 30,
    w.heightSegments  || 30,
    w.phiStart        || 0,
    w.phiLength       || Math.PI * 2,
    w.thetaStart      || 0,
    w.thetaLength     || Math.PI
  );
  let box  = (w) => new THREE.BoxBufferGeometry(
    dod(w, 'width', 100),
    dod(w, 'height', 100),
    dod(w, 'depth', 100),
    dod(w, 'wparts', 1),
    dod(w, 'hparts', 1),
    dod(w, 'dparts', 1)
  );
  let m    = (geo, mat ) => new THREE.Mesh   (geo, mat);
  let vec  = (x, y, z  ) => new THREE.Vector3(x, y, z);
  let cube = (s, p     ) => box({
    width  : s,
    height : s,
    depth  : s,
    wparts : p,
    hparts : p,
    dparts : p
  });
//


// THREE.js Helper
  function CustomSinCurve(scale) {
      THREE.Curve.call(this);
      this.scale = scale === undefined ? 1 : scale;
  }

  CustomSinCurve.prototype = Object.create(THREE.Curve.prototype);
  CustomSinCurve.prototype.constructor = CustomSinCurve;
//

// Geometries
  let parametric = (w) => {
    let geo = new THREE.ParametricGeometry(w.f, w.s1 || 20, w.s2 || 20);
    return (m(geo, w.mat || new THREE.MeshStandardMaterial( { color: 0x00ff00, side : THREE.DoubleSide } )))
  };

  let cone = (w) => {
    let radius = w.radius || 1;
    return parametric(
      {
        f : (u,v, vec) => {
          vec.x = radius * u;
          vec.y = radius * u * Math.cos(Math.PI * 2 * v);
          vec.z = radius * u * Math.sin(Math.PI * 2 * v);
        }
      }
    )
  };

//
