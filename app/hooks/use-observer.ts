import { useEffect, useRef, useState } from 'react';

const useObserver = (items: any[], callback: () => void) => {
  const observerTarget = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (observerTarget?.current === null) {
          return;
        }

        if (entries[0].isIntersecting) {
          setCount((v) => v + 1);
          observer.disconnect();
          callback();
        }
      },
      { threshold: 1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [items, observerTarget]);

  return { observerTarget, count };
};

export default useObserver;
