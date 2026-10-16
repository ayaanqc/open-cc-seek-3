import { useEffect } from 'react';

/**
 * Mouse parallax: updates --mx/--my CSS variables on a container so child
 * fluid blobs drift subtly with the cursor. Kept restrained for a premium feel.
 */
export function useParallax(ref, { strength = 14 } = {}) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const onMove = (e) => {
      const rect = node.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      node.style.setProperty('--mx', `${x * strength}px`);
      node.style.setProperty('--my', `${y * strength}px`);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [ref, strength]);
}

/**
 * Scroll reveal: adds .is-visible when an element enters the viewport so
 * .reveal children fade up smoothly. Disabled under reduced motion.
 */
export function useReveal(ref, { threshold = 0.14, rootMargin = '-10% 0px -15% 0px' } = {}) {
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
          node.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin]);
}
