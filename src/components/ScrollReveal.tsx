'use client';

import { useEffect } from 'react';

/**
 * Ports the static site's scroll-reveal behaviour:
 *   const obs = new IntersectionObserver(...)
 *   document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
 *
 * Mount this once near the root of each page (after the content that has
 * .reveal elements). It re-scans on every route change because each page
 * is a fresh mount.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), 60);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.07 }
    );

    const targets = document.querySelectorAll('.reveal');
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
