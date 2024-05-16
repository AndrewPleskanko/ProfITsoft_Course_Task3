export const saveToStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const getFromStorage = (key, defaultValue) => {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : defaultValue;
};