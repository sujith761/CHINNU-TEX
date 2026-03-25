import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered reveal animations.
 * Uses IntersectionObserver to add 'revealed' class when elements enter viewport.
 * 
 * @param {Object} options
 * @param {number} options.threshold - Percentage of element visible before triggering (0-1)
 * @param {string} options.rootMargin - CSS margin around root element
 * @param {boolean} options.once - If true, only trigger once (default: true)
 * @returns {React.RefObject} ref - Attach this to the element you want to animate
 */
export function useScrollReveal({ threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = {}) {
  const ref = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          el.classList.add('revealed');
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsRevealed(false);
          el.classList.remove('revealed');
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isRevealed };
}

/**
 * Hook that observes all children of a container for scroll reveal.
 * Perfect for staggered list animations.
 * 
 * @param {Object} options
 * @param {string} options.childSelector - CSS selector for children to observe
 * @param {string} options.animationClass - Class to add when revealed (default: 'revealed')
 * @param {number} options.threshold - IntersectionObserver threshold
 * @param {number} options.staggerDelay - Delay between each child in ms
 * @returns {React.RefObject} containerRef - Attach to the parent container
 */
export function useScrollRevealChildren({
  childSelector = ':scope > *',
  animationClass = 'revealed',
  threshold = 0.1,
  staggerDelay = 100,
} = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.querySelectorAll(childSelector);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(children).indexOf(entry.target);
            setTimeout(() => {
              entry.target.classList.add(animationClass);
            }, idx * staggerDelay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    children.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, [childSelector, animationClass, threshold, staggerDelay]);

  return containerRef;
}

export default useScrollReveal;
