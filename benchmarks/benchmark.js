/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/**
 * @fileoverview We write our own performance test instead of using
 * benchmark.js due to the fact that the sort functions aren't pure.
 * That is to say, the sort functions mutate the passed in array
 * instead of returning a new array. Because benchmark.js runs setup
 * only once before running a test multiple times, it means that we will
 * be repeatedly sorting a sorted array, which won't give us accurate
 * measurements.
 */

const { performance } = require('perf_hooks');
const TimSort = require('timsort');
const dualPivotQuickSort = require('../index');

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
        // gives a high chance of repeating values.
        tests[i].push(Math.floor(Math.random() * Math.cbrt(testSize)));
      }
    }
  }
  return tests;
};

/**
 * @param fn
 *  The sorting function to measure
 * @param testList
 *  The tests to give to fn
 * @param isNative
 *  True if we are testing Array.prototype.sort(), and false
 *  otherwise. We do this because the native sort gets the
 *  array from a this binding rather than by argument. We
 *  could have wrapped the native sort inside a function,
 *  but function calls would corrupt the data.
 */
const measurePerformance = (fn, testList, isNative) => {
  const timeResults = [];
  const heapUsedResults = [];
  for (let i = 0; i < testList.length; i += 1) {
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
  }
  timeResults.sort();
  heapUsedResults.sort();
  // Return the median instead of the average to account for
  // warm up results which could skew the average.
  return {
    'Time Spent (ns)': Math.round(timeResults[Math.floor(timeResults.length / 2)] * 1000000),
    'Heap Used (mb)': heapUsedResults[Math.floor(timeResults.length / 2)],
  };
};

const run = (testCount, testSize) => {
  console.log('Initializing tests...');
  const testsRandom = populateTests('random', testCount, testSize);
  const testsAscending = populateTests('ascending', testCount, testSize);
  const testsDescending = populateTests('descending', testCount, testSize);
  const testsManyEqual = populateTests('manyEqual', testCount, testSize);
  console.log('Tests initialized.');

  const suite = {
    'Tim Sort': TimSort.sort,
    'Dual-Pivot Quick Sort': dualPivotQuickSort,
    'Native Sort': Array.prototype.sort,
  };

  const resultsRandom = {};
  const resultsAscending = {};
  const resultsDescending = {};
  const resultsManyEqual = {};

  for (const name of Object.keys(suite)) {
    const isNative = name === 'Native Sort' ? true : false;
    // Need copy since our sort functions aren't pure.
    // That is, they mutate the passed in array.
    const testsRandomCopy = testsRandom.slice();
    const testsAscendingCopy = testsAscending.slice();
    const testsDescendingCopy = testsDescending.slice();
    const testsManyEqualCopy = testsManyEqual.slice();

    console.log(`\nRunning tests for ${name} with random arrays...`);
    const resRandom = measurePerformance(suite[name], testsRandomCopy, isNative);
    console.log(`Running tests for ${name} with ascending arrays...`);
    const resAscending = measurePerformance(suite[name], testsAscendingCopy, isNative);
    console.log(`Running tests for ${name} with descending arrays...`);
    const resDescending = measurePerformance(suite[name], testsDescendingCopy, isNative);
    console.log(`Running tests for ${name} with many-equal arrays...`);
    const resManyEqual = measurePerformance(suite[name], testsManyEqualCopy, isNative);
    console.log('Done!');

    resultsRandom[name] = resRandom;
    resultsAscending[name] = resAscending;
    resultsDescending[name] = resDescending;
    resultsManyEqual[name] = resManyEqual;
  }

  console.log('\n====================== RANDOM ARRAYS =======================');
  console.table(resultsRandom);
  console.log('\n===================== ASCENDING ARRAYS =====================');
  console.table(resultsAscending);
  console.log('\n===================== DESCENDING ARRAYS ====================');
  console.table(resultsDescending);
  console.log('\n===================== MANY-EQUAL ARRAYS ====================');
  console.table(resultsManyEqual);
};

run(100, 10000);
