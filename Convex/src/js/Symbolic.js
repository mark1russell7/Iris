// Symbolic object, getters, setters
  let operator = (term) => term['operator'];
  let terms    = (term) => term['terms'   ];
  function Term(op, terms){
    this['operator'] = op   ;
    this['terms'   ] = terms;
  }
//

// Symbolic Constructors
  let add  = (terms) => new Term('add' , [terms[0], terms.length === 2 ? terms[1] : add (terms.slice(1))]);
  let mult = (terms) => new Term('mult', [terms[0], terms.length === 2 ? terms[1] : mult(terms.slice(1))]);
  let div  = (terms) => new Term('div' , terms);
  let sub  = (terms) => new Term('sub' , terms);
  let num  = (val  ) => new Term('num' , val  );
  let vari = (name ) => new Term('var' , name );
  let exp  = (terms) => new Term('exp' , terms);
//

// Allows faster check for arity of formulae
  let singles = new Set();
  singles.add('num');
  singles.add('var');
//


// Math Evaluator
  // By First-Order-Logic, we evaluate an formula by lazily applying its main operator to the
  // recursive evaluation of its sub-formulae.
  let evaluate = (f, assignments={}) => {
    // Vectors
      if(f instanceof Array) return f.map(e => evaluate(e, assignments));
    // Formulae
      let left, right;
      // Binary arity operators require recursive evaluation of two sub-formulae
        if(operator(f) !== undefined && !singles.has(operator(f))){
          left  = evaluate(terms(f)[0], assignments);
          right = evaluate(terms(f)[1], assignments);
        }
      //
  // -- The author acknowledges that the 'var' case is written in a way that does not allow for partial
  //    formula evaluation / variable assignments; this will be worked on in the future --
      switch (operator(f)) {
        case 'add'  : return left + right;
        case 'sub'  : return left - right;
        case 'mult' : return left * right;
        case 'div'  : return left / right;
        case 'exp'  : return left ** right;
        // we tag pure values as well to allow for symbolic differentiation and allow for other meta-structural procedures
          case 'num'  : return terms(f);
        //
        case 'var'  : return (assignments[terms(f)] !== undefined) ? assignments[terms(f)] : 0;
        default     : console.log(f, assignments);
      }
  };
//

// ∇ Gradient
  let gradient = (f, vs) => vs.map(v => derive(f, v));
//

// Symbolic Differentiator
  let derive = (f, v) => {
    switch(operator(f)){
      case 'add'  :
      case 'sub'  : return new Term(operator(f), terms(f).map(t => derive(t,v)));
      case 'mult' : return new Term('add', [0,1].map(which => new Term('mult', [derive(terms(f)[which], v), terms(f)[(which + 1) % 2]])));
      case 'div' :
        return new Term('div', [
          new Term('sub', [0,1].map(which =>
            new Term('mult', [
              terms(f)[which],
              derive(terms(f)[(which + 1) % 2], v     )]))),
          new Term('exp', [
            terms(f)[1],
            num(2)                                    ])
        ]);
      case 'exp' :
        return new Term('mult', [
          derive(terms(f)[0], v),
          new Term('mult', [
            terms(f)[1],
            new Term('exp', [
              terms(f)[0],
              new Term('sub',[
                  terms(f)[1],
                  num(1)                               ])])])]);
      case 'num' : return num(0);
      case 'var' : return terms(f).localeCompare(v) === 0 ? num(1) : num(0);
      default : console.log(f, v);
    }
  };
//


// evaluates 'Ax' for an m x n matrix A and an m-component vector, x
let matrix = (matr, inp) => {
  let out = [0,0,0];
  for(let i = 0, kl = matr.length; i < kl; ++i)
    for(let j = 0, kll = inp.length; j < kll; ++j)
      out[i] += matr[i][j] * inp[j];
  return out;
};

// 'Defined or Default', checks if an object has a property and if so returns its value,
//  otherwise returns a specified default value
let dod = (w, v, d) => w[v] === undefined ? d : w[v];
