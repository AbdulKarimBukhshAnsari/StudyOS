'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Progress } from '@/components/ui/progress';

export function TopProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Reset and show progress bar
    setTimeout(() => {
      setIsVisible(true);
    }, 0);
    setTimeout(() => {
      setProgress(0);
    }, 0);

    // Simulate progress
    const timer1 = setTimeout(() => setProgress(30), 100);
    const timer2 = setTimeout(() => setProgress(60), 300);
    const timer3 = setTimeout(() => setProgress(90), 500);

    // Complete when navigation is done
    const timer4 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setProgress(0), 200);
      }, 200);
    }, 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1">
      <Progress
        value={progress}
        className="h-1 rounded-none transition-all duration-300"
      />
    </div>
  );
}

