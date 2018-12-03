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

const TimSort = require('timsort');

const QuickSort = require('../dist/index');
const populateTests = require('./utils/populateTests');
const measurePerformance = require('./utils/measurePerformance');

const run = (testCount, testSize) => {
  console.log('Initializing tests...');
  const testsRandom = populateTests('random', testCount, testSize);
  const testsAscending = populateTests('ascending', testCount, testSize);
  const testsDescending = populateTests('descending', testCount, testSize);
  const testsManyEqual = populateTests('manyEqual', testCount, testSize);
  console.log('Tests initialized.');

  const suite = {
    'Tim Sort': TimSort.sort,
    'Dual-Pivot Quick Sort': QuickSort.sort,
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
    console.log('\x1b[32m%s\x1b[0m', 'Done!');

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

run(1000, 1000);
