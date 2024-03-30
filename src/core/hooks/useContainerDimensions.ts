/* eslint-disable no-undef */
import { useState, useEffect } from 'react';

interface ContainerDimensions {
  width: number;
  height: number;
}

const useContainerDimensions = (myRef: React.MutableRefObject<any>): ContainerDimensions => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getDimensions());
    };

    const getDimensions = () => ({
      width: myRef.current?.offsetWidth,
      height: myRef.current?.offsetHeight
    });

    if (myRef.current) setDimensions(getDimensions());

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [myRef]);

  return dimensions;
};

export default useContainerDimensions;
