import { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number; // duration in milliseconds, default is 1200
  prefix?: string;
  suffix?: string;
  format?: (value: number) => string;
}

export default function AnimatedCounter({
  target,
  duration = 1200,
  prefix = "",
  suffix = "",
  format
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Easing function outQuad for beautiful, smooth slowing down
            const easeProgress = progress * (2 - progress);
            
            const currentVal = Math.floor(easeProgress * target);
            setCount(currentVal);
            
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(target);
            }
          };
          
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [target, duration]);

  // If target changes, allow animating again or reset
  useEffect(() => {
    hasAnimated.current = false;
    // trigger animation resetting if currently visible
    if (elementRef.current) {
      // Small trigger to force observer callback if visible
      const el = elementRef.current;
      el.style.opacity = "0.99";
      setTimeout(() => {
        if (el) el.style.opacity = "1";
      }, 50);
    }
  }, [target]);

  const displayValue = format ? format(count) : count.toLocaleString("id-ID");

  return (
    <span ref={elementRef} className="tabular-nums">
      {prefix}{displayValue}{suffix}
    </span>
  );
}
