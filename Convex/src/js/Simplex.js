

let range = (s,e) => {
  let arr = [];
  for(let i = s; i <= e; ++i)
    arr.push(i);
  return arr;
};

function LP(w) {
  let chain = camera_seq, points = [], line, graph, graphs = [], mat = new MeshLineMaterial({
    color: w.color || 0xff0000,
    lineWidth : .25,
    side : THREE.DoubleSide,
    depthWrite : false,
    depthTest : false
  });
  this.c = w['c'];
  if(w['isMax'] === true) this.c = math.multiply(this.c, math.number(-1));
  this.A = w.equalities;
  this.b = w.b;
  this['slack variables'] = [];
  this.positives = w.positives;
  this.variables = range(1, w.num);
  this['var map'] = this.variables.filter(e => w.positives.has(e)).map(e => 'x' + e);
  let total = 0;

  // Slack Variables
  w.inequalities.forEach((ineq) => {
    this['slack variables'].push('s' + this['slack variables'].length);
    this.A.forEach(row => row.push(0));
    for(let i = 1; i <= total; ++i)
      ineq.push(0);
    ineq.push(1);
    this.A.push(ineq);
    total++;
    this.c.push(0);
  });

  this.uvs = [];
  total = 0;

  // u-v variables
  this.variables.filter(e => !this.positives.has(e)).forEach(
    u => {
      total++;
      this.variables.splice(u-total,1);
      let coeff = this.c[u-total];
      this.c.splice(u-total,1);
      this.c.push(coeff);
      this.c.push(-coeff);
      this.uvs.push(['u','v'].map(e => e + this.uvs.length));
      for(let i = 0, kl = this.A.length; i < kl; ++i){
        let row = this.A[i];
        let coeff = row[u-total];
        row.splice(u-total, 1);
        row.push(coeff);
        row.push(-coeff);
      }

    }
  );


  let save = [];
  this.A.forEach(e => {
    let arr = [];
    e.forEach(f => arr.push(f));
    save.push(arr);
  });

  // display constraints
  camera_seq.then((done)=> {
    save.forEach((e,i) => {
      linopt.addConstraint({normal : new THREE.Vector3(...e), centroid : new THREE.Vector3(1,1,e[2] / (this.b[i] - e[0] - e[1])).multiplyScalar(1)});
    });
    done();
  });

  this.uvs.forEach(e => {
    this['var map'].push(e[0]);
    this['var map'].push(e[1]);
  });
  this['slack variables'].forEach(e => {
    this['var map'].push(e);
  });
  [...this.A, this.c].forEach(row => {
    let sl = this['slack variables'].length;
    let ul = this.uvs.length*2;

    let temps = [];
    range(2, 2 + sl - 1).forEach(i => temps.push(row[i]));
    range(2, 2 + ul - 1).forEach(i => row[i] = row[i + sl]);
    range(2 + ul, 2 + ul + sl - 1).forEach(i => row[i] = temps[i - (2 + ul)]);

  });
  // add b_is
  this.A.forEach((e,i) => e.push(this.b[i]));

  // add relative costs
  this.c.push(0);
  this.A.push(this.c);

  this.basics = new Set();
  this.pivots = [];

  // initial basic variables
  range(this.A[0].length - (2 + this['slack variables'].length), this.A[0].length - 2).forEach(i => {
    this.pivots.push(i);
    this.basics.add(i);
  });
  let num = 0;
  while(true) {
    let row, col;
    let set = new Set();  // prevents infinite cycle if previously picked column failed to have a valid row
    let count = 0;
    while (true) {
      if(w.num <= count)
        return;
      let minval = this.A[this.A.length - 1][0];
      let minindex = 0;
      // find column with min relative cost
      for (let index = 0, kl = this.A[this.A.length - 1].length; index < kl; ++index) {
        if (!set.has(index) && this.A[this.A.length - 1][index] < minval) {
          minval = this.A[this.A.length - 1][index];
          minindex = index;
        }
      }
      col = minindex;
      minval = this.A[0][this.A[0].length - 1] / this.A[0][col];
      minindex = 0;
      let went = false;
      // find row with min ratio bi/aij
      for (let index = 0, kl = this.A.length; index < kl; ++index) {
        if (this.A[index][col] > 0 && (this.A[index][this.A[index].length - 1] / this.A[index][col] < minval || this.A[minindex][col] <= 0)) {
          minval = this.A[index][this.A[index].length - 1]  / this.A[index][col];
          minindex = index;
          went = true;
        }
      }
      if (!went && this.A[0][col] < 0) {
        set.add(col); // prevents infinite cycle as picked column failed to have a valid row and would otherwise be chosen again
        count++;
        continue; //
      }
      if (minindex === -1) {
        console.log("no optimal solutions");
        return;
      }
      row = minindex;
      if (this.A[row][col] > 0)
        break;
    }
    let v = this.A[row][col];

    // perform row operations to transform leaving column into the appropriate standard basis vector

    for (let index = 0, kl = this.A[row].length; index < kl; ++index)
      this.A[row][index] /= v;

    let val = -this.A[this.A.length -1][col];
    for (let index = 0, kl = this.A[row].length; index < kl; ++index)
      this.A[this.A.length - 1][index] += this.A[row][index] / val;


    for (let index = 0, kl = this.A.length; index < kl; ++index) {
      if (index !== row) {
        let save = this.A[index][col];
        for (let i = 0, kll = this.A[index].length; i < kll; ++i) {
          this.A[index][i] -= this.A[row][i] * save;
        }
      }
    }

    // update storage of basic variables
    this.basics.delete(this.pivots[row]);
    this.basics.add(col);
    this.pivots[row] = col;

    // construct tableau text graphic
    let printarr = [];
    printarr.push("p = " + -(this.A[this.A.length - 1][this.A[this.A.length - 1].length - 1] + "").substring(0, 4));

    this.pivots.map((col, row) => this['var map'][col] + " = " + (this.A[row][this.A[row].length - 1] + "").substring(0,4)).forEach(e => printarr.push(e));

    this['var map'].filter((s, e) => !this.pivots.some(f => e === f)).map(e => e + " = 0").forEach(e => printarr.push(e));

    printarr.push("");
    printarr.push("Tableau : ");
    printarr.push("");

    this.A.forEach((e) => printarr.push(e.map((f) => "\t" + ((f+"    ").substring(0, 4) + "\t"))));

    chain.then((done) => {
      setTimeout(() => {

        if(graph)
          scene.remove(graph);
        graph = tableau_graphic(printarr);
        graph.position.x += 350;
        scene.add(graph);
        graphs.push(graph);

        done();
      }, 100);
    });
    let vals = [];
    this.pivots.map((col, row) => this.A[row][this.A[row].length - 1]).forEach(e => vals.push(e));

    // draw solution traversal path as a line in the coordinate space
    chain.then((done) => {
      let vecc = vec(...vals);
      // vecc.y = -this.A[this.A.length - 1][this.A[this.A.length - 1].length - 1];
      points.push(vecc);
      let geo = new THREE.Geometry();
      points.forEach(e => geo.vertices.push(e));
      if(line)
        linopt.Base.remove(line);
      line = new MeshLine();
      line.setGeometry(geo);
      line = m(line.geometry, mat);
      linopt.Base.add(line);
      done();
    });
    if(this.A[this.A.length - 1].every(e => e >= 0))
      break;
    num++;
  }
  // appropriately setup buttons to allow traversal through the steps of the algorithm
  chain.then((done) => {
    setTimeout(() => {
      let cur = graphs.length - 1;
      let forward = make_button(vec(300 + 350,100,0), "blue", ">", () => {
        if(cur < graphs.length - 1){
          cur++;
          scene.remove(graph);
          graph = graphs[cur];
          scene.add(graph);
        }
      });
      let backward = make_button(vec(-50 + 350,100,0), "blue", "<", () => {
        if(cur > 0){
          cur--;
          scene.remove(graph);
          graph = graphs[cur];
          scene.add(graph);
        }
      });
      scene.add(forward);
      scene.add(backward);
      done();
    }, 100);
  });



}

//
// let l = new LP({
//   num : 3,
//   b : [
//     1,5,4,5
//   ],
//   positives : (() => {
//     let set = new Set();
//     set.add(1);
//     set.add(2);
//     return set;
//   })(),
//   c : [
//     -1, -2, -3
//   ],
//   isMax : false,
//   equalities : [
//     [1,1,-1],
//   ],
//   inequalities : [
//     [2,-1,-2],
//     [1,-1,0],
//     [0,1,1]
//   ]
// });

let tableau_graphic = (text) => {
  let length = 150*4;
  let width = 150*4;
  let plate_geo = new THREE.PlaneBufferGeometry(length,width);
  let canvas = document.createElement('canvas');

  canvas.height = 1024* 1.5;
  canvas.width = 1024 * 1.5;

  let context = canvas.getContext('2d');
  context.font = 32  + "px sans-serif";
  context.fillStyle = 'black';
  context.textBaseline = 'top';
  context.textAlign = 'left';
  // context.rotate(0);
  context.translate(0,0);

  text.forEach((t,i) => context.fillText(t, 0, i * 32));

  let plate_mat = mbm({
    map : new THREE.Texture(canvas),
    transparent : true,
    side : THREE.DoubleSide
    // depthTest : false
  });

  plate_mat.map.needsUpdate = true;

  let plate = m(plate_geo, plate_mat);

  plate.position.set(300, 45, 0);
  return plate;
};


let n1 = 4;
let n = 4;

// let l = new LP({
//   num : n1,
//   b : [
//     ...range(0, n).map(e => Math.round(10 *(Math.random() - .5)))
//   ],
//   positives : (() => {
//     let set = new Set();
//     range(1,n).forEach(e => set.add(e));
//     return set;
//   })(),
//   c : [
//     ...range(1,n1-1).map(e => -(e+1))
//   ],
//   isMax : false,
//   equalities : [
//     ...range(0, n).map(e => range(0,n1-2).map(e => Math.round(30 *(Math.random() - .5))))
//   ],
//   inequalities : [
//     // ...range(0, 5).map(e => range(0,7).map(e => Math.round(30 *(Math.random() - .5))))
//   ]
// });

// let l = new LP({
//   num : 4,
//   b : [
//     1,5,4,8
//   ],
//   positives : (() => {
//     let set = new Set();
//     set.add(1);
//     set.add(2);
//     set.add(3);
//     set.add(4);
//     return set;
//   })(),
//   c : [
//     -1, -2, -5, -3
//   ],
//   isMax : false,
//   equalities : [
//     [1,5,-1, 1],
//     [3, 0, 15, 5],
//     [5, 1, 7, 7],
//     [7, 3,-2, 8],
//     // [17, 10, 13],
//   ],
//   inequalities : []
// });

let l = new LP({
  num : 3,
  b : [
    1, 100, 10000
  ],
  positives : (() => {
    let set = new Set();
    set.add(1);
    set.add(2);
    set.add(3);
    return set;
  })(),
  c : [
    -100, -10, -1
  ],
  isMax : false,
  equalities : [
  ],
  inequalities : [
    [1, 0 , 0],
    [20, 1 , 0],
    [200, 20 , 1],
  ]
});
