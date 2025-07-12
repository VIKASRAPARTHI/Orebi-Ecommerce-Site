import { useEffect, useRef, useState } from 'react';

// Custom hook to handle click outside events safely
export const useClickOutside = (callback) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      // Check if ref exists and contains the clicked element
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [callback]);

  return ref;
};

// Custom hook for toggle functionality with click outside
export const useToggleWithClickOutside = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);
  
  const ref = useClickOutside(close);
  
  return { isOpen, toggle, close, ref };
};
