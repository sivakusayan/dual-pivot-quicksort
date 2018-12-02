const swap = require('./utils/swap');

const dualPivotQuickSortLoop = (array, low, high, comparator) => {
  if (high <= low) return;
  if (array[low] > array[high]) {
    swap(array, low, high);
  }
  // TODO: Implement better pivot choices
  const lowPivot = array[low];
  const highPivot = array[high];
  // The future position of lowPivot after this iteration
  // will be 1 behind this.
  let newLowPosition = low + 1;
  // The future position of highPivot after this iteration
  // will be 1 ahead of this.
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
        // Move newHighPosition backwards as far as possible.
        newHighPosition -= 1;
      }
      swap(array, cursor, newHighPosition);
      newHighPosition -= 1;
      // Check if swapped element should be in the
      // partition behind lowPivot
      if (array[cursor] < lowPivot) {
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
  dualPivotQuickSortLoop(array, low, newLowPosition - 1, comparator);
  dualPivotQuickSortLoop(array, newLowPosition + 1, newHighPosition - 1, comparator);
  dualPivotQuickSortLoop(array, newHighPosition, high, comparator);
};

/**
 * A variation of quickSort, invented by Vladimir Yaroslavskiy,
 * that uses two pivots instead of one. For a visualization,
 * see https://learnforeverlearn.com/yaro_web/
 *
 * @param {[]} array
 *  List to sort
 * @param {Function} comparator
 *  A function comparator(a,b) that allows sorting by a user-defined order.
 *  Return true if a <= b, and return false otherwise. By default, it compares
 *  a.valueOf() and b.valueOf().
 *
 */
const dualPivotQuickSort = (array, comparator = (a, b) => a.valueOf() <= b.valueOf()) => {
  dualPivotQuickSortLoop(array, 0, array.length - 1, comparator);
};

module.exports = dualPivotQuickSort;
