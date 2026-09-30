import Lenis from 'lenis';
import { mapOffsetToCurveT } from './logic/scrollMath';

/**
 * CLIENT ORCHESTRATOR
 *
 * Implements:
 * 1. Progressive enhancement: replaces 'no-js' with 'js'
 * 2. Instant first paint: 3D scene lazy-loaded asynchronously after initial render
 * 3. Lenis smooth scrolling (disabled if prefers-reduced-motion: reduce)
 * 4. Real DOM section offset tracking (recomputed on resize)
 * 5. 3D Cryptographic Evidence Seal positioning along Catmull-Rom spline
 * 6. Chain of Custody navigation & active stage tracking via CSS classes
 * 7. Hero name redaction bar lift signature reveal
 */

const SECTION_IDS = ['identity', 'credentials', 'skills', 'works', 'contact'];

let sectionTops: number[] = [];
let lenisInstance: Lenis | null = null;
let updateSceneTarget: ((t: number) => void) | null = null;

function recomputeSectionOffsets(): void {
  sectionTops = SECTION_IDS.map((id) => {
    const el = document.getElementById(id);
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return rect.top + window.scrollY;
  });
}

function handleScroll(scrollY: number): void {
  if (!updateSceneTarget) return;
  const t = mapOffsetToCurveT(scrollY, window.innerHeight, sectionTops);
  updateSceneTarget(t);
}

function initHeroRedaction(): void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wrap = document.querySelector('.redaction-wrap');
  if (!wrap) return;

  if (prefersReducedMotion) {
    wrap.classList.add('is-revealed');
    return;
  }

  // Lift the redaction bar smoothly shortly after initial paint
  setTimeout(() => {
    wrap.classList.add('is-revealed');
  }, 350);
}

function setupCustodyObserver(): void {
  const sections = document.querySelectorAll<HTMLElement>('.dossier-section');
  const railLinks = document.querySelectorAll<HTMLAnchorElement>('.rail-link');
  const headerLinks = document.querySelectorAll<HTMLAnchorElement>('.header-nav a');

  if (!('IntersectionObserver' in window) || sections.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');

          railLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('is-active');
            } else {
              link.classList.remove('is-active');
            }
          });

          headerLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('is-active');
            } else {
              link.classList.remove('is-active');
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

  sections.forEach((s) => observer.observe(s));
}

function setupAnchorNavigation(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const targetEl = document.querySelector(href);
      if (!targetEl) return;

      e.preventDefault();

      if (lenisInstance) {
        lenisInstance.scrollTo(href, { offset: 0, duration: 1.2 });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }

      // Update URL hash and accessibility focus
      history.pushState(null, '', href);
      if (targetEl instanceof HTMLElement) {
        targetEl.focus({ preventScroll: true });
      }
    });
  });
}

async function lazyLoadScene(): Promise<void> {
  try {
    const { SceneManager } = await import('./scene/SceneManager');
    const sceneManager = new SceneManager(document.body);
    const initialized = sceneManager.init();
    if (initialized) {
      updateSceneTarget = (t: number) => sceneManager.updateTargetT(t);
      handleScroll(window.scrollY);
    }
  } catch (err) {
    console.warn('Could not lazy-load 3D scene:', err);
  }
}

function init(): void {
  // Progressive enhancement: mark document as JavaScript-enabled
  document.documentElement.classList.replace('no-js', 'js');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Compute initial section DOM offsets
  recomputeSectionOffsets();
  window.addEventListener('resize', () => {
    recomputeSectionOffsets();
    handleScroll(window.scrollY);
  });

  // 2. Setup hero redaction reveal
  initHeroRedaction();

  // 3. Setup UI observers & navigation
  setupCustodyObserver();
  setupAnchorNavigation();

  // 4. Initialize Smooth Scrolling (Lenis) if motion is permitted
  if (!prefersReducedMotion) {
    lenisInstance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.8,
    });

    lenisInstance.on('scroll', (e: { scroll: number }) => {
      handleScroll(e.scroll);
    });

    const raf = (time: number): void => {
      lenisInstance?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  } else {
    // Native scroll event fallback
    window.addEventListener('scroll', () => {
      handleScroll(window.scrollY);
    });
  }

  // 5. Lazy-load 3D scene after initial paint (satisfies AGENTS.md lazy-load gate)
  requestAnimationFrame(() => {
    setTimeout(lazyLoadScene, 50);
  });
}

// Defer initialization until after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
