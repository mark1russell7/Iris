let area;
camera_seq.then((done) => {

  area = new Area(500);


  let plate = update("Enter an Equation (in prefix)");
  area.Base.add(plate);

  let eq = "";
  let up = () => {
    area.Base.remove(plate);
    plate = update(eq);
    area.Base.add(plate);
  };

  let s = new Set();
  s.add('+');
  s.add('-');
  s.add('/');
  s.add('*');
  s.add('^');


  let lsave1;
  let lsave2;


  let has = (f) => (typeof f).localeCompare('object') === 0 && f.v !== undefined;

  let opstack = [];

  let vars = new Set();

  let plus = make_button(vec(0,0,0),'yellow', '+', ()=>{
    if(opstack.length === 0 || has(opstack[opstack.length - 1]) || has(opstack[opstack.length - 2])){
      opstack.push({v : "+"}); eq += " ( + "; up();}
  });
  let minus = make_button(vec(45,0,0),'yellow', '-', ()=>{
    if(opstack.length === 0 || has(opstack[opstack.length - 1]) || has(opstack[opstack.length - 2])){
      opstack.push({v : "-"}); eq += " ( - "; up();}
  });
  let divide = make_button(vec(0,-45,0),'yellow', '/', ()=>{
    if(opstack.length === 0 || has(opstack[opstack.length - 1]) || has(opstack[opstack.length - 2])){
      opstack.push({v : "/"}); eq += " ( / "; up();}
  });
  let multiply = make_button(vec(45,-45,0),'yellow', '*', ()=>{
    if(opstack.length === 0 || has(opstack[opstack.length - 1]) || has(opstack[opstack.length - 2])){
      opstack.push({v : "*"}); eq += " ( * "; up();}
  });
  let exponent = make_button(vec(90,0,0),'yellow', '^', ()=>{
    if(opstack.length === 0 || has(opstack[opstack.length - 1]) || has(opstack[opstack.length - 2])){
      opstack.push({v : "^"}); eq += " ( ^ "; up();}
  });

  let clear = make_button(vec(180,0,0),'red', 'clear', ()=>{
    opstack = [];
    eq = "";
    up();
    if(lsave1) window.removeEventListener('keypress',lsave1,true);
    if(lsave2) window.removeEventListener('keypress',lsave2,true);
  });

  let submit = make_button(vec(135,-45,0),'green', 'submit', ()=>{
    let f = opstack.pop();
    let exam = ((() => {
      let ru = 16;
      let rv = 16;
      let ou = -.5;
      let ov = -.5;
      let surf = parametric({
        f : (u, v, vec) => {
          let fu = (u + ou) * ru;
          let fv = (v + ov) * rv;
          vec.x = fu;
          vec.y = evaluate(f, {x : fu, y : fv});
          vec.z = fv;
        },
        s1 : 100,
        s2 : 100,
        mat : surfmat
      });
      return example({
        fxn : f,
        visual : surf,
        size : cubesize - boundary_size * 2
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
    let ex = new Example(exam, DescentArea.Base);


    let arrs = [];
    vars.forEach(e => arrs.push(e + ", "));
    let eqv = arrs.reduce((a,b) => a + b);
    eqv = eqv.substr(0, eqv.length-2);
    let req = "f(" + eqv + ") = " + eq;
    let area = descent_setup(ex, DescentArea.Base, cubesize, boundary_size, req);
    placer(area.Base);


    opstack = [];

    eq = "Enter an Equation (in prefix)";
    up();
    eq = "";

    if(lsave1) window.removeEventListener('keypress',lsave1,true);
    if(lsave2) window.removeEventListener('keypress',lsave2,true);


  });


  let variable = make_button(vec(90,-45,0),'yellow', 'xyz', ()=>{

    let listener = (e) => {
      // get as keyboard
      vars.add(e.key);
      if(opstack.length > 1 && !has(opstack[opstack.length - 1])
        || (typeof opstack[opstack.length-1]).localeCompare("number") === 0 || (typeof opstack[opstack.length-1]).localeCompare("string") === 0)
      {
        let arg1;
        if(opstack.length > 1 && !has(opstack[opstack.length - 1]) && (typeof opstack[opstack.length-1]).localeCompare("object") === 0)
          arg1 = opstack.pop();
        else if((typeof opstack[opstack.length-1]).localeCompare("number") === 0)
          arg1 = num(opstack.pop());
        else if((typeof opstack[opstack.length-1]).localeCompare("string") === 0)
          arg1 = vari(opstack.pop());
        let arg2 = vari(e.key);
        eq += " " + e.key + " ) ";
        let op = opstack.pop();
        switch (op.v) {
          case '+' : opstack.push(add([arg1, arg2])); break;
          case '-' : opstack.push(sub([arg1, arg2])); break;
          case '/' : opstack.push(div([arg1, arg2])); break;
          case '*' : opstack.push(mult([arg1, arg2])); break;
          case '^' : opstack.push(exp([arg1, arg2])); break;
        }
        while(opstack.length > 2 && !has(opstack[opstack.length - 2])){
          let arg1 = opstack.pop();
          let arg2;
          if((typeof opstack[opstack.length-1]).localeCompare("number") === 0)
            arg2 = num(opstack.pop());
          else if((typeof opstack[opstack.length-1]).localeCompare("string") === 0)
            arg2 = vari(opstack.pop());
          else arg2 = opstack.pop();

          eq += " ) ";
          let op = opstack.pop();
          switch (op.v) {
            case '+' : opstack.push(add([arg2, arg1])); break;
            case '-' : opstack.push(sub([arg2, arg1])); break;
            case '/' : opstack.push(div([arg2, arg1])); break;
            case '*' : opstack.push(mult([arg2, arg1])); break;
            case '^' : opstack.push(exp([arg2, arg1])); break;
          }
        }

      }else{
        opstack.push(e.key);
        eq += " "+e.key+" ";
      }
      up();
      window.removeEventListener('keypress',listener,true);
    };
    lsave1 = listener;
    window.addEventListener('keypress', listener,true)
  });
  let number = make_button(vec(135,0,0),'yellow', '123', ()=>{
      let listener = (e) => {

        // get as keyboard input !!

        if(opstack.length > 1 && !has(opstack[opstack.length - 1])
          || (typeof opstack[opstack.length-1]).localeCompare("number") === 0 || (typeof opstack[opstack.length-1]).localeCompare("string") === 0)
        {
          let arg1;
          if(opstack.length > 1 && !has(opstack[opstack.length - 1]) && (typeof opstack[opstack.length-1]).localeCompare("object") === 0)
            arg1 = opstack.pop();
          else if((typeof opstack[opstack.length-1]).localeCompare("number") === 0)
            arg1 = num(opstack.pop());
          else if((typeof opstack[opstack.length-1]).localeCompare("string") === 0)
            arg1 = vari(opstack.pop());

          let arg2 = num(Number(e.key));
          eq += " "+Number(e.key)+" ) ";
          let op = opstack.pop();
          switch (op.v) {
            case '+' : opstack.push(add([arg1, arg2])); break;
            case '-' : opstack.push(sub([arg1, arg2])); break;
            case '/' : opstack.push(div([arg1, arg2])); break;
            case '*' : opstack.push(mult([arg1, arg2])); break;
            case '^' : opstack.push(exp([arg1, arg2])); break;
          }
          while(opstack.length > 2 && !has(opstack[opstack.length - 2])){
            let arg1 = opstack.pop();

            let arg2;
            if((typeof opstack[opstack.length-1]).localeCompare("number") === 0)
              arg2 = num(opstack.pop());
            else if((typeof opstack[opstack.length-1]).localeCompare("string") === 0)
              arg2 = vari(opstack.pop());
            else arg2 = opstack.pop();
            eq += " ) ";
            let op = opstack.pop();
            switch (op.v) {
              case '+' : opstack.push(add([arg1, arg2])); break;
              case '-' : opstack.push(sub([arg1, arg2])); break;
              case '/' : opstack.push(div([arg1, arg2])); break;
              case '*' : opstack.push(mult([arg1, arg2])); break;
              case '^' : opstack.push(exp([arg1, arg2])); break;
            }
          }
        }else{
          opstack.push(Number(e.key));
          eq += " "+Number(e.key)+" ";
        }
        up();
        window.removeEventListener('keypress',listener,true);
      };
    lsave2 = listener;
    window.addEventListener('keypress', listener,true)
  });

  area.Base.add(plus);
  area.Base.add(minus);
  area.Base.add(divide);
  area.Base.add(multiply);
  area.Base.add(exponent);
  area.Base.add(variable);
  area.Base.add(number);
  area.Base.add(submit);
  area.Base.add(clear);

  // scene.add(area.Base);
  // area.Base.position.x -= 1000;
  // camera.position.x -= 1000;
  // controls.target = area.Base.position.clone();

  camera.add(area.Base);
  area.Base.scale.multiplyScalar(1/2);
  area.Base.position.z -= 350;
  area.Base.position.x -= 1.5*window.innerWidth/8;
  area.Base.position.y -= 150;




  done();
});


let update = (text) => {
  let length = 150*4;
  let width = 15*2;
  let plate_geo = new THREE.PlaneBufferGeometry(length,width);
  let canvas = document.createElement('canvas');

  canvas.height = 256;
  canvas.width = 2560*2;

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
    // depthTest : false
  });

  plate_mat.map.needsUpdate = true;

  let plate = m(plate_geo, plate_mat);

  plate.position.set(300, 45, 0);
  return plate;
};







