/**
 * A variation of quickSort, invented by Vladimir Yaroslavskiy,
 * that uses two pivots instead of one.
 *
 * @param {[]} array
 *  List to sort
 * @param {Function} comparator
 *  A function comparator(a,b) that allows sorting by a user-defined order.
 *  Return true if a <= b, and return false otherwise. By default, it compares
 *  a.valueOf() and b.valueOf().
 *
 */
const quickSort = (array, comparator = (a, b) => a.valueOf() <= b.valueOf()) => {

};

module.exports = quickSort;
