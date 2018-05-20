/**
 * Make memoized selector for resolving entity references in normalized store.
 * @param {String} propertyName Name of entity reference property
 * @param {Function} getCollection Get entity collection from root state
 * @param {Function} [getEntity] Get entity by id from collection
 * @returns {Function} Linked entity selector
 */
export function entitySelector(propertyName, getCollection, getEntity) {
  if (arguments.length === 2) {
    getEntity = getCollection;
    getCollection = state => state;
  }

  if (!PRODUCTON) {
    const originalGetEntity = getEntity;
    // check references in development mode
    getEntity = (collection, id) => {
      const entity = originalGetEntity(collection, id);
      if (!entity) {
        throw new Error(
          `Can not resolve entity [${id}] for property "${propertyName}"`
        );
      }
      return entity;
    };
  }

  const weakMap = typeof WeakMap === "function" && new WeakMap();
  const __propertyName = "__" + propertyName;

  return state => {
    const propertyValue = this[propertyName];
    if (propertyValue == null) {
      return propertyValue;
    }

    const collection = getCollection(state);
    // memoization is not needed for single entity reference
    // bacause we don't create new arrays or objects
    if (typeof propertyValue !== "object") {
      return getEntity(collection, propertyValue);
    }

    let cacheEntry;
    if (weakMap) {
      // cache results in associated WeakMap
      let cacheObject = weakMap.get(this);
      if (!cacheObject) {
        cacheObject = {};
        weakMap.set(this, cacheObject);
      }
      cacheEntry = cacheObject[propertyName];
      if (!cacheEntry) {
        cacheEntry = { state: null, value: null };
        cacheObject[propertyName] = cacheEntry;
      }
    } else {
      // cache result in non-enumerable hidden property of `this` object
      cacheEntry = this[__propertyName];
      if (!cacheEntry) {
        cacheEntry = { state: null, value: null };
        Object.defineProperty(this, __propertyName, { value: cacheEntry });
      }
    }

    // if entity collection is not changed we can return previous value
    if (cacheEntry.state === collection) {
      return cacheEntry.value;
    }
    cacheEntry.state = collection;

    if (Array.isArray(propertyValue)) {
      cacheEntry.value = propertyValue.map(id => getEntity(collection, id));
    } else {
      const dict = {};
      for (const key in propertyValue) {
        dict[key] = getEntity(collection, propertyValue[key]);
      }
      cacheEntry.value = dict;
    }

    return cacheEntry.value;
  };
}

let PRODUCTON = false;
try {
  // @ts-ignore
  PRODUCTON = process.env.NODE_ENV.toLowerCase() === "production";
} catch {}