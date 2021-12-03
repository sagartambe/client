export const getItem = (item) => {
  try {
    return localStorage.getItem(item);
  } catch (err) {
    return undefined;
  }
};
export const setItem = (item, value) => {
  try {
    localStorage.setItem(item, value);
  } catch (err) {
    return undefined;
  }
};

export const removeItem = (item) => {
  try {
    localStorage.removeItem(item);
  } catch (err) {
    return undefined;
  }
};