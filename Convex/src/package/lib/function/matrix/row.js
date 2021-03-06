'use strict';

var clone = require('../../utils/object').clone;

var validateIndex = require('../../utils/array').validateIndex;

function factory(type, config, load, typed) {
  var MatrixIndex = load(require('../../type/matrix/MatrixIndex'));
  var matrix = load(require('../../type/matrix/function/matrix'));
  var range = load(require('./range'));
  /**
   * Return row in Matrix.
   *
   * Syntax:
   *
   *     math.row(value, index)    // retrieve a row
   *
   * Example:
   *
   *     // get a row
   *     const d = [[1, 2], [3, 4]]
   *     math.row(d, 1))        // returns [3, 4]
   *
   * See also:
   *
   *     column
   *
   * @param {Array | Matrix } value   An array or matrix
   * @param {number} row              The index of the row
   * @return {Array | Matrix}         The retrieved row
   */

  var row = typed('row', {
    'Matrix, number': _row,
    'Array, number': function ArrayNumber(value, row) {
      return _row(matrix(clone(value)), row).valueOf();
    }
  });
  row.toTex = undefined; // use default template

  return row;
  /**
   * Retrieve a row of a matrix
   * @param {Matrix } value  A matrix
   * @param {number} row     The index of the row
   * @return {Matrix}        The retrieved row
   */

  function _row(value, row) {
    // check dimensions
    if (value.size().length !== 2) {
      throw new Error('Only two dimensional matrix is supported');
    }

    validateIndex(row, value.size()[0]);
    var columnRange = range(0, value.size()[1]);
    var index = new MatrixIndex(row, columnRange);
    return value.subset(index);
  }
}

exports.name = 'row';
exports.factory = factory;