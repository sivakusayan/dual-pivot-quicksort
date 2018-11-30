/**
 * Takes in an array, swaps the specified indices.
 */
const swap = (array, i, j) => {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
};

module.exports = swap;
