const swap = require('./utils/swap');

const quickSortLoop = (array, low, high, comparator) => {
  if (high - low <= 0) return;
  if (array[low] > array[high]) {
    swap(array, low, high);
  }
  const lowPivot = array[low];
  const highPivot = array[high];
  // The future position of lowPivot after this iteration
  let newLowPosition = low + 1;
  // The future position of highPivot after this iteration
  let newHighPosition = high - 1;
  // Scans the list
  let cursor = newLowPosition;
  while (cursor <= newHighPosition) {
    if (array[cursor] < lowPivot) {
      // Move cursor to the partition behind lowPivot,
      // while maintaining the structure ahead of lowPivot
      swap(array, cursor, newLowPosition);
      newLowPosition += 1;
    } else if (array[cursor] >= highPivot) {
      while (array[newHighPosition] > highPivot && cursor < newHighPosition) {
        // Move the new highPosition until we see an element it is
        // bigger than.
        newHighPosition -= 1;
      }
      swap(array, cursor, newHighPosition);
      newHighPosition -= 1;
      if (array[cursor] < lowPivot) {
        // Move cursor to the partition behind lowPivot,
        // while maintaining the structure ahead of lowPivot
        swap(array, cursor, newLowPosition);
        newLowPosition += 1;
      }
    }
    cursor += 1;
  }
  newLowPosition -= 1;
  newHighPosition += 1;
  swap(array, low, newLowPosition);
  swap(array, high, newHighPosition);
  quickSortLoop(array, low, newLowPosition - 1, comparator);
  quickSortLoop(array, newLowPosition + 1, newHighPosition - 1, comparator);
  quickSortLoop(array, newHighPosition, high, comparator);
};

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
  // TODO: Implement better pivot choices
  quickSortLoop(array, 0, array.length - 1, comparator);
};

quickSort(array);

console.log(array);

module.exports = quickSort;
