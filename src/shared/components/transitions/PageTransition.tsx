'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<'fadeIn' | 'fadeOut'>('fadeIn');

  useEffect(() => {
    setTransitionStage('fadeOut');
    
    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setTransitionStage('fadeIn');
    }, 150);

    return () => clearTimeout(timeout);
  }, [pathname, children]);

  return (
    <div
      className={`transition-all duration-300 ${
        transitionStage === 'fadeOut'
          ? 'opacity-0 translate-y-2'
          : 'opacity-100 translate-y-0'
      }`}
    >
      {displayChildren}
    </div>
  );
}
