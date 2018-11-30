const quickSort = require('./index');

// TODO: Test on larger arrays later to benchmark performance

describe('Quicksort Sorting Checks', () => {
  it('should sort the empty array', () => {
    expect(quickSort([])).toEqual([]);
  });

  it('should sort singletons', () => {
    expect(quickSort([1])).toEqual([1]);
  });

  it('should sort array', () => {
    const array = [9, 4, 6, 1, 5, 2, 8, 56, 100];
    const sortedArray = [1, 2, 4, 5, 6, 8, 9, 56, 100];

    expect(quickSort(array)).toEqual(sortedArray);
  });

  it('should sort a sorted array', () => {
    const sortedArray = [1, 2, 4, 5, 6, 8, 9, 56, 100];
    expect(quickSort(sortedArray).toEqual(sortedArray));
  });

  it('should sort a reverse sorted array', () => {
    const array = [100, 56, 9, 8, 6, 5, 4, 2, 1];
    const sortedArray = [1, 2, 4, 5, 6, 8, 9, 56, 100];
    expect(quickSort(array).toEqual(sortedArray));
  });

  it('should sort with custom comparator', () => {
    const array = [9, 4, 6, 1, 5, 2, 8, 56, 100];
    const comparator = (a, b) => a >= b;
    const sortedArray = [100, 56, 9, 8, 6, 5, 4, 2, 1];

    expect(quickSort(array, comparator)).toEqual(sortedArray);
  });

  it('should sort with duplicate entries', () => {
    const array = [9, 9, 4, 6, 1, 5, 5, 2, 8, 56, 100];
    const sortedArray = [1, 2, 4, 5, 5, 6, 8, 9, 9, 56, 100];

    expect(quickSort(array)).toEqual(sortedArray);
  });
});
