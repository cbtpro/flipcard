import React, { useRef, useEffect } from 'react';
import { FlipCard, FlipCardOptions } from '@chenbitao/core';

export const FlipCardReact: React.FC<{
  children: React.ReactNode;
  options?: FlipCardOptions;
}> = ({ children, options }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const flip = new FlipCard(ref.current, options);
    return () => flip.destroy();
  }, []);

  return <div ref={ref} className="flipcard">{children}</div>;
};
