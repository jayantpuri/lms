import React, { useState, useEffect } from "react";

interface useDebounceProps {
  value: string;
  delay?: number;
}
const useDebounce = ({ value, delay = 500 }: useDebounceProps) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    let timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return debouncedValue;
};

export default useDebounce;
