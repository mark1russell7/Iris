


let placer;
let DescentArea;
camera_seq.then(
  (done) => {
    DescentArea = new Area(area_size);
    // scene.add(DescentArea.Base);
    let arr = gradientDescentExamples({size : cubesize - 2*boundary_size});
    placer = cube_placer(arr[0].example[0].Base);
    [1,2,3].forEach(i => placer(arr[i].example[0].Base));
    master_placer(DescentArea.Base);




    DescentArea.Base.add(m(
      spherex({radius : area_size/2, width : area_size, height : area_size, depth : cubesize + 2 * boundary_size, wparts : 50, hparts : 50, dparts : 50}),
      msm({
        transparent : true,
        roughness : .5,
        color : 'blue',
        metalness : .5,
        opacity : .2,
        // side : THREE.DoubleSide,
        depthWrite : false,
        depthTest : false
      })

    ));
    add_plate(area_size, area_size/10, 'Descent', DescentArea).position.z = (cubesize + 2 * boundary_size)/2;
    let but = add_button(area_size, area_size/10, DescentArea, () => set_and_focus(DescentArea.Base.position, vec(0,0,area_size)), 'blue');

    camera.add(but);

    but.scale.multiplyScalar(1/22.5);
    but.position.x = 12;
    but.position.y = -5;
    but.position.z = -10;


    //
    //
    // but.position.x = area_size/2;
    // but.position.z = (cubesize + 2 * boundary_size)/2;
    // but.scale.multiplyScalar(3);

    // arr[0].example[0].Base.position.x += cubesize;
    // arr[2].example[0].Base.position.x -= cubesize;
    // arr[3].example[0].Base.position.x -= cubesize*2;


    arr[1].example[1].x.y = 2.8;
    arr[1].example[1].x.x = 1.75;

    arr[2].example[1].x.y = 3.5;
    arr[2].example[1].x.x = 5;
    arr[3].example[1].x.y = 0;
    arr[3].example[1].x.x = -5;
    arr[3].example[1].lineWidth = .4;
    let area = descent_setup(arr[0], DescentArea.Base, cubesize, boundary_size, "f(x,y) = x^2 - 7x + y^2");
    let area2 = descent_setup(arr[1], DescentArea.Base, cubesize, boundary_size, "f(x,y) = x^4 + y^4");
    let area3 = descent_setup(arr[2], DescentArea.Base, cubesize, boundary_size, "f(x,y) = x^2 + xy + y^4");


    let area4 = descent_setup(arr[3], DescentArea.Base, cubesize, boundary_size, "f(x) = x^2 + x");


    // conjugate_example({});

    done();
  }
);
