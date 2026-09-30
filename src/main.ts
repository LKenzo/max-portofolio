import Lenis from 'lenis';
import { mapOffsetToCurveT } from './logic/scrollMath';

/**
 * CLIENT ORCHESTRATOR
 *
 * Implements:
 * 1. Instant first paint: 3D scene lazy-loaded asynchronously after initial render
 * 2. Lenis smooth scrolling (disabled if prefers-reduced-motion: reduce)
 * 3. Real DOM section offset tracking (recomputed on resize)
 * 4. 3D Cryptographic Evidence Seal positioning along Catmull-Rom spline
 * 5. Active margin rail indicators
 * 6. Accessible keyboard and anchor navigation
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

function setupRailObserver(): void {
  const sections = document.querySelectorAll<HTMLElement>('.dossier-section');
  const railLinks = document.querySelectorAll<HTMLAnchorElement>('.rail-link');

  if (!('IntersectionObserver' in window) || sections.length === 0 || railLinks.length === 0) {
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
              link.style.color = 'var(--accent-cyan)';
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
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Compute initial section DOM offsets
  recomputeSectionOffsets();
  window.addEventListener('resize', () => {
    recomputeSectionOffsets();
    handleScroll(window.scrollY);
  });

  // 2. Setup UI observers & navigation
  setupRailObserver();
  setupAnchorNavigation();

  // 3. Initialize Smooth Scrolling (Lenis) if motion is permitted
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

  // 4. Lazy-load 3D scene after initial paint (satisfies AGENTS.md lazy-load gate)
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
