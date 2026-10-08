import Lenis from 'lenis';
import { mapOffsetToCurveT } from './logic/scrollMath';
import { PROFILE } from './data/profile';
import { generateHexDump, generateOffsetStream, type StreamItem } from './logic/hexDump';

/**
 * CLIENT ORCHESTRATOR
 *
 * Implements:
 * 1. Progressive enhancement: marks document as JavaScript-enabled
 * 2. Instant first paint: 3D scene lazy-loaded asynchronously after initial render
 * 3. Lenis smooth scrolling (disabled if prefers-reduced-motion: reduce)
 * 4. Real DOM section offset tracking (recomputed on resize)
 * 5. 3D Cryptographic Evidence Seal positioning along Catmull-Rom spline
 * 6. Section navigation & active stage tracking via CSS classes
 * 7. Signature Moment 1: Hero name redaction bar lift
 * 8. Signature Moment 2: Dual full-viewport stream background with lerped UV flashlight
 */

const SECTION_IDS = ['identity', 'credentials', 'skills', 'works', 'contact'];

let sectionTops: number[] = [];
let lenisInstance: Lenis | null = null;
let updateSceneTarget: ((t: number) => void) | null = null;
let updateSceneOffsets: ((tops: readonly number[]) => void) | null = null;

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
  const words = document.querySelectorAll<HTMLElement>('.redaction-word');
  if (words.length === 0) return;

  if (prefersReducedMotion) {
    words.forEach((w) => w.classList.add('is-revealed'));
    return;
  }

  // Lift the redaction bars sequentially per word shortly after initial paint
  words.forEach((word, idx) => {
    setTimeout(() => {
      word.classList.add('is-revealed');
    }, 320 + idx * 160);
  });
}

/**
 * Signature Moment 2: Dual Stream Background Layers & Lerped UV Flashlight
 * - Layer A: Real UTF-8 bytes scrolling upward in infinite loop
 * - Layer B: Offset stream of verified records and projects scrolling downward
 * - Soft radial gradient with smooth lerp lag
 */
function initGlobalUvLayerAndCursor(): void {
  const streamAEl = document.getElementById('uv-stream-a');
  const streamADupEl = document.getElementById('uv-stream-a-dup');
  const streamBEl = document.getElementById('uv-stream-b');
  const streamBDupEl = document.getElementById('uv-stream-b-dup');

  // 1. Populate Layer A: Real UTF-8 bytes from verified profile text
  if (streamAEl && streamADupEl) {
    const rawText = [
      PROFILE.identity.fullName,
      PROFILE.identity.headline,
      PROFILE.identity.location,
      PROFILE.identity.backgroundSummary,
      ...PROFILE.education.map((e) => `${e.institution} - ${e.degree} (GPA ${e.gpa})`),
      ...PROFILE.certifications.map((c) => `${c.name} by ${c.issuer}`),
      ...PROFILE.projects.map((p) => `${p.name}: ${p.summary}`),
    ].join('\n');

    const dumpA = generateHexDump(rawText, 140, true);
    streamAEl.textContent = dumpA;
    streamADupEl.textContent = dumpA;
  }

  // 2. Populate Layer B: Real sections, degree progress, and featured projects
  if (streamBEl && streamBDupEl) {
    const streamBItems: StreamItem[] = [
      { offset: 0x0000, category: '01 ABOUT', value: 'MAX FRENAT // BINUS' },
      { offset: 0x0020, category: 'DEGREE', value: 'B.CS CYBERSECURITY (GPA 3.63)' },
      { offset: 0x0040, category: '02 EDU', value: 'EDUCATION & CERTIFICATIONS' },
      { offset: 0x0060, category: 'CERTIF', value: 'FORTINET FCF CYBERSECURITY' },
      { offset: 0x0080, category: '03 SKILLS', value: 'SYSTEMS, NETWORKS, SCRIPTING' },
      { offset: 0x00a0, category: 'TOOLS', value: 'XXD, GHIDRA, GDB, RADARE2' },
      { offset: 0x00c0, category: 'NETWORK', value: 'WIRESHARK, TSHARK, OPENSSL' },
      { offset: 0x00e0, category: '04 PROJECTS', value: 'FEATURED CASE STUDIES' },
      ...PROFILE.projects.slice(0, 5).map((p, idx) => ({
        offset: 0x0100 + idx * 0x20,
        category: `PROJ 0${idx + 1}`,
        value: p.name.toUpperCase(),
      })),
      { offset: 0x0200, category: '05 CONTACT', value: 'DIRECT PROFILES & REPOSITORIES' },
      { offset: 0x0220, category: 'STATUS', value: 'READY FOR INTERNSHIPS' },
    ];

    const dumpB = generateOffsetStream(streamBItems, 140, true);
    streamBEl.textContent = dumpB;
    streamBDupEl.textContent = dumpB;
  }

  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isFinePointer || prefersReducedMotion) {
    return;
  }

  // 3. Smooth Lerped Light Tracking (slight physical lag ~0.12)
  let targetX = -500;
  let targetY = -500;
  let currentX = -500;
  let currentY = -500;
  const LERP_FACTOR = 0.12;

  window.addEventListener('pointermove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (currentX === -500) {
      currentX = targetX;
      currentY = targetY;
    }
  });

  window.addEventListener('pointerleave', () => {
    targetX = -500;
    targetY = -500;
  });

  const revealElements = Array.from(
    document.querySelectorAll<HTMLElement>('.case-annotation, .tech-box-content')
  );

  function animateLight(): void {
    currentX += (targetX - currentX) * LERP_FACTOR;
    currentY += (targetY - currentY) * LERP_FACTOR;

    document.documentElement.style.setProperty('--uv-x', `${currentX.toFixed(1)}px`);
    document.documentElement.style.setProperty('--uv-y', `${currentY.toFixed(1)}px`);

    // Compute beam position relative to each hash and annotation element (CSP-safe CSSOM)
    for (let i = 0; i < revealElements.length; i++) {
      const el = revealElements[i];
      const rect = el.getBoundingClientRect();
      const relX = currentX - rect.left;
      const relY = currentY - rect.top;
      el.style.setProperty('--beam-x', `${relX.toFixed(1)}px`);
      el.style.setProperty('--beam-y', `${relY.toFixed(1)}px`);
    }

    requestAnimationFrame(animateLight);
  }
  requestAnimationFrame(animateLight);
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
    const sceneManager = new SceneManager(document.body, sectionTops);
    const initialized = sceneManager.init(sectionTops);
    if (initialized) {
      updateSceneTarget = (t: number) => sceneManager.updateTargetT(t);
      updateSceneOffsets = (tops: readonly number[]) => sceneManager.setSectionOffsets(tops);
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
    updateSceneOffsets?.(sectionTops);
    handleScroll(window.scrollY);
  });

  // 2. Setup hero redaction reveal
  initHeroRedaction();

  // 3. Setup Global UV Viewport Layer
  initGlobalUvLayerAndCursor();

  // 5. Setup UI observers & navigation
  setupCustodyObserver();
  setupAnchorNavigation();

  // 6. Initialize Smooth Scrolling (Lenis) if motion is permitted
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

  // 7. Lazy-load 3D scene after initial paint (satisfies AGENTS.md lazy-load gate)
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
