/**
 * Creates a predicate function for Array `.filter()` to:
 * Create a duplicate-free version of an array,
 * in which only the first occurrence of each element is kept.
 */
export const distinct = () => {
  const keys = [];
  return (item) => {
    if (keys.lastIndexOf(item) !== -1) {
      return false;
    }
    keys.push(item);
    return true;
  };
};

/**
 * Creates a predicate function for Array `.filter()` to:
 * Create a duplicate-free version of an array, using value returned by selector function
 * for equality comparisons, in which only the first occurrence of each element is kept.
 */
export const distinctBy = (selector) => {
  const keys = [];
  return (item) => {
    const key = selector(item);
    if (keys.lastIndexOf(key) !== -1) {
      return false;
    }
    keys.push(key);
    return true;
  };
};

/**
 * Creates a predicate function for Array `.filter()` to:
 * Create a duplicate-free version of an array, using comparer function
 * for equality comparisons, in which only the first occurrence of each element is kept.
 */
export const distinctWith = (comparer) => {
  const keys = [];
  return (item) => {
    let i = keys.length;
    while (i--) {
      if (comparer(keys[i], item)) {
        return false;
      }
    }
    keys.push(item);
    return true;
  };
};

/**
 * Creates a predicate function for Array `.filter()` to:
 * Return elements from an array as long as a specified condition is true.
 */
export const takeWhile = (predicate) => {
  let shouldTake = true;
  return (item, i) => shouldTake && (shouldTake = predicate(item, i));
};

/**
 * Creates a predicate function for Array `.filter()` to:
 * Bypass elements in a sequence as long as a specified condition is true
 * and then return the remaining elements.
 */
export const skipWhile = (predicate) => {
  let shouldTake = false;
  return (item, i) => shouldTake || (shouldTake = !predicate(item, i));
};
