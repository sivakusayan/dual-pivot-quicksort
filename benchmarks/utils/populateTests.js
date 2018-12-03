/**
 * Sets up the tests for benchmarking.
 *
 * @param {'random' | 'ascending' | 'descending'} mode
 *  Determines how we populate the tests.
 * @param {Number} testCount
 *  The amount of tests to run for each function
 * @param {Number} testSize
 *  The size of the array each function will sort
 */
const populateTests = (mode, testCount, testSize) => {
  const tests = [];
  for (let i = 0; i < testCount; i += 1) {
    tests[i] = [];
    for (let j = 0; j < testSize; j += 1) {
      if (mode === 'random') {
        tests[i].push(Math.floor(Math.random() * 9007199254740992));
      } else if (mode === 'ascending') {
        tests[i].push(j);
      } else if (mode === 'descending') {
        tests[i].push(-j);
      } else if (mode === 'manyEqual') {
        // Works by the pigeonhole principle. In short, filling a large
        // amount of spaces with a range of numbers that is much smaller
        // gives a high chance of repeating values. In particular, we
        // guarantee that atleast one value appears atleast testSize^(2/3)
        // times.
        tests[i].push(Math.floor(Math.random() * Math.cbrt(testSize)));
      }
    }
  }
  return tests;
};

module.exports = populateTests;
