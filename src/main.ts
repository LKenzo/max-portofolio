import { PROFILE } from './data/profile';

/**
 * PHASE A: Client Entry Point
 *
 * All primary textual content is statically pre-rendered in index.html for instant first paint,
 * zero layout shift, and search indexing compliance.
 * Phase B will bind smooth scrolling (Lenis), section triggers (GSAP), and the 3D Evidence Seal.
 */

function initDossier(): void {
  // Ensure profile data loads and is intact
  if (!PROFILE || !PROFILE.identity) {
    console.error('Profile data failed to load.');
    return;
  }

  // Active rail link tracking based on scroll position using IntersectionObserver
  const sections = document.querySelectorAll<HTMLElement>('.dossier-section');
  const railLinks = document.querySelectorAll<HTMLAnchorElement>('.rail-link');

  if ('IntersectionObserver' in window && sections.length > 0 && railLinks.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            railLinks.forEach((link) => {
              const href = link.getAttribute('href');
              if (href === `#${id}`) {
                link.style.color = 'var(--accent-cobalt)';
                link.style.fontWeight = '700';
              } else {
                link.style.color = '';
                link.style.fontWeight = '';
              }
            });
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }
}

// Execute after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDossier);
} else {
  initDossier();
}
