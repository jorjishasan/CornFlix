const findDeeplyNestedObj = (key, obj) => {
  if (obj === null || typeof obj !== "object") {
    return undefined;
  }

  if (key in obj) {
    return obj[key];
  }

  for (let k of Object.keys(obj)) {
    const result = findDeeplyNestedObj(key, obj[k]);
    if (result !== undefined) {
      return result;
    }
  }

  return undefined;
};

export default findDeeplyNestedObj;
