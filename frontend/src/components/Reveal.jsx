import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * Scroll-triggered text reveal: words fade up and stagger in as the section
 * enters the viewport. Subtle, no bounce.
 */
export default function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible');
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.fromTo(
            node,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay }
          );
          observer.disconnect();
        }
      },
      { threshold: 0.13, rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
