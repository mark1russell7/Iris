'use strict'

const DimensionError = require('../../../error/DimensionError')

function factory (type, config, load, typed) {
  const equalScalar = load(require('../../../function/relational/equalScalar'))

  const SparseMatrix = type.SparseMatrix

  /**
   * Iterates over SparseMatrix A and SparseMatrix B nonzero items and invokes the callback function f(Aij, Bij).
   * Callback function invoked MAX(NNZA, NNZB) times
   *
   *
   *          ┌  f(Aij, Bij)  ; A(i,j) !== 0 || B(i,j) !== 0
   * C(i,j) = ┤
   *          └  0            ; otherwise
   *
   *
   * @param {Matrix}   a                 The SparseMatrix instance (A)
   * @param {Matrix}   b                 The SparseMatrix instance (B)
   * @param {Function} callback          The f(Aij,Bij) operation to invoke
   *
   * @return {Matrix}                    SparseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97620294
   */
  const algorithm05 = function (a, b, callback) {
    // sparse matrix arrays
    const avalues = a._values
    const aindex = a._index
    const aptr = a._ptr
    const asize = a._size
    const adt = a._datatype
    // sparse matrix arrays
    const bvalues = b._values
    const bindex = b._index
    const bptr = b._ptr
    const bsize = b._size
    const bdt = b._datatype

    // validate dimensions
    if (asize.length !== bsize.length) { throw new DimensionError(asize.length, bsize.length) }

    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) { throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')') }

    // rows & columns
    const rows = asize[0]
    const columns = asize[1]

    // datatype
    let dt
    // equal signature to use
    let eq = equalScalar
    // zero value
    let zero = 0
    // callback signature to use
    let cf = callback

    // process data types
    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt
      // find signature that matches (dt, dt)
      eq = typed.find(equalScalar, [dt, dt])
      // convert 0 to the same datatype
      zero = typed.convert(0, dt)
      // callback
      cf = typed.find(callback, [dt, dt])
    }

    // result arrays
    const cvalues = avalues && bvalues ? [] : undefined
    const cindex = []
    const cptr = []
    // matrix
    const c = new SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    })

    // workspaces
    const xa = cvalues ? [] : undefined
    const xb = cvalues ? [] : undefined
    // marks indicating we have a value in x for a given column
    const wa = []
    const wb = []

    // vars
    let i, j, k, k1

    // loop columns
    for (j = 0; j < columns; j++) {
      // update cptr
      cptr[j] = cindex.length
      // columns mark
      const mark = j + 1
      // loop values A(:,j)
      for (k = aptr[j], k1 = aptr[j + 1]; k < k1; k++) {
        // row
        i = aindex[k]
        // push index
        cindex.push(i)
        // update workspace
        wa[i] = mark
        // check we need to process values
        if (xa) { xa[i] = avalues[k] }
      }
      // loop values B(:,j)
      for (k = bptr[j], k1 = bptr[j + 1]; k < k1; k++) {
        // row
        i = bindex[k]
        // check row existed in A
        if (wa[i] !== mark) {
          // push index
          cindex.push(i)
        }
        // update workspace
        wb[i] = mark
        // check we need to process values
        if (xb) { xb[i] = bvalues[k] }
      }
      // check we need to process values (non pattern matrix)
      if (cvalues) {
        // initialize first index in j
        k = cptr[j]
        // loop index in j
        while (k < cindex.length) {
          // row
          i = cindex[k]
          // marks
          const wai = wa[i]
          const wbi = wb[i]
          // check Aij or Bij are nonzero
          if (wai === mark || wbi === mark) {
            // matrix values @ i,j
            const va = wai === mark ? xa[i] : zero
            const vb = wbi === mark ? xb[i] : zero
            // Cij
            const vc = cf(va, vb)
            // check for zero
            if (!eq(vc, zero)) {
              // push value
              cvalues.push(vc)
              // increment pointer
              k++
            } else {
              // remove value @ i, do not increment pointer
              cindex.splice(k, 1)
            }
          }
        }
      }
    }
    // update cptr
    cptr[columns] = cindex.length

    // return sparse matrix
    return c
  }

  return algorithm05
}

exports.name = 'algorithm05'
exports.factory = factory
