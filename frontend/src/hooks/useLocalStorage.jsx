import { useEffect, useState } from 'react';

const useLocalStorage = (key, initialValue) => {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored JSON or return initialValue if not present
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Return initialValue in case of error
      console.log(error);
      return initialValue;
    }
  });

  // useEffect to update local storage whenever the value changes
  useEffect(() => {
    try {
      // If storedValue is a function, call it with the current value
      const valueToStore =
        typeof storedValue === 'function'
          ? storedValue(storedValue)
          : storedValue;
      // Save the value in localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Handle errors gracefully
      console.log(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;
