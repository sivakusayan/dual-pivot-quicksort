const { performance } = require('perf_hooks');

/**
 * @param fn
 *  The sorting function to measure
 * @param testList
 *  The tests to give to fn
 * @param isNative
 *  True if we are testing Array.prototype.sort(), and false
 *  otherwise. We do separate cases because the native sort
 *  gets the array from a this binding rather than by argument.
 *  We could have wrapped the native sort inside a function,
 *  but function calls would corrupt the performance data.
 */
const measurePerformance = (fn, testList, isNative) => {
  const timeResults = [];
  const heapUsedResults = [];
  for (let i = 0; i < testList.length; i += 1) {
    process.stdout.write(`Test ${i + 1} of ${testList.length}`);
    // Different branch for Array.prototype.sort()
    // due to differing API.
    if (isNative) {
      const { heapUsed } = process.memoryUsage();
      const curr = performance.now();

      testList[i].sort();

      timeResults.push(performance.now() - curr);
      heapUsedResults.push(process.memoryUsage().heapUsed - heapUsed);
    } else {
      const { heapUsed } = process.memoryUsage();
      const curr = performance.now();

      fn(testList[i]);

      timeResults.push(performance.now() - curr);
      heapUsedResults.push(process.memoryUsage().heapUsed - heapUsed);
    }
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }
  timeResults.sort();
  heapUsedResults.sort();
  // Return the median instead of the average to account for
  // warm up results which could skew the average.
  return {
    // Convert from milliseconds to nanoseconds
    'Time Spent (ns)': Math.round(timeResults[Math.floor(timeResults.length / 2)] * 1000000),
    'Heap Used (mb)': heapUsedResults[Math.floor(timeResults.length / 2)],
  };
};

module.exports = measurePerformance;
