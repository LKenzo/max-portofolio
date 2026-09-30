import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight,
  Clock,
  type CatmullRomCurve3,
} from 'three';
import { EvidenceSeal } from './geometry/EvidenceSeal';
import { createTravelPath } from './path/travelPath';
import { FallbackRenderer } from './FallbackRenderer';
import { getTravelerScale } from '../logic/scrollMath';

/**
 * THREE.JS SCENE MANAGER
 *
 * Implements strict AGENTS.md quality gates:
 * - Cap pixel ratio at 2
 * - Pause render loop when off-screen via IntersectionObserver
 * - Full memory disposal (geometries, materials, renderer)
 * - Accessible static fallback for prefers-reduced-motion and no-WebGL
 * - Dynamic mobile scale adjustment
 */

export class SceneManager {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement | null = null;
  private scene: Scene | null = null;
  private camera: PerspectiveCamera | null = null;
  private renderer: WebGLRenderer | null = null;
  private seal: EvidenceSeal | null = null;
  private curve: CatmullRomCurve3 | null = null;
  private fallback: FallbackRenderer | null = null;

  private isRunning = false;
  private isPaused = false;
  private animId: number | null = null;
  private clock = new Clock();
  private observer: IntersectionObserver | null = null;

  // Cached state for smooth interpolation
  private currentT = 0;
  private targetT = 0;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public init(): boolean {
    // 1. Accessibility Gate: prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.mountFallback();
      return false;
    }

    // 2. WebGL Support Gate
    if (!this.isWebGLAvailable()) {
      this.mountFallback();
      return false;
    }

    // 3. Initialize Three.js WebGL Scene
    try {
      this.scene = new Scene();

      // Camera setup
      const aspect = window.innerWidth / window.innerHeight;
      this.camera = new PerspectiveCamera(45, aspect, 0.1, 100);
      this.camera.position.set(0, 0, 10);

      // Canvas & Renderer with strict capped pixel ratio
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'scene-traveler-canvas';
      this.canvas.style.position = 'fixed';
      this.canvas.style.inset = '0';
      this.canvas.style.width = '100vw';
      this.canvas.style.height = '100vh';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '5';
      this.container.appendChild(this.canvas);

      this.renderer = new WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Lighting: Key light, rim light, and ambient
      const ambientLight = new AmbientLight(0xffffff, 0.7);
      this.scene.add(ambientLight);

      const keyLight = new DirectionalLight(0x00f0ff, 2.2);
      keyLight.position.set(5, 8, 7);
      this.scene.add(keyLight);

      const rimLight = new DirectionalLight(0x3b82f6, 1.8);
      rimLight.position.set(-6, -4, 5);
      this.scene.add(rimLight);

      // 4. Procedural Traveler & Path
      const isMobile = window.innerWidth < 768;
      this.curve = createTravelPath(isMobile);
      this.seal = new EvidenceSeal();

      const scale = getTravelerScale(window.innerWidth);
      this.seal.group.scale.set(scale, scale, scale);

      // Initial position at curve start (Hero)
      const p0 = this.curve.getPointAt(0);
      this.seal.group.position.copy(p0);
      this.scene.add(this.seal.group);

      // 5. Visibility Pause Observer
      this.setupObserver();

      // 6. Bind resize
      window.addEventListener('resize', this.onResize);

      // Start render loop
      this.isRunning = true;
      this.clock.start();
      this.animate();

      return true;
    } catch (err) {
      console.warn('Three.js initialization failed, falling back to static vector:', err);
      this.mountFallback();
      return false;
    }
  }

  /**
   * Sets the target curve position t in [0, 1] based on section offset progress
   */
  public updateTargetT(t: number): void {
    this.targetT = Math.min(Math.max(t, 0), 1);
  }

  private animate = (): void => {
    if (!this.isRunning) return;

    this.animId = requestAnimationFrame(this.animate);

    if (this.isPaused || !this.renderer || !this.scene || !this.camera || !this.seal || !this.curve) {
      return;
    }

    const delta = Math.min(this.clock.getDelta(), 0.1);

    // Smooth lerp toward targetT to prevent sudden jumps
    this.currentT += (this.targetT - this.currentT) * 0.08;

    // Sample 3D position along the spline
    const pos = this.curve.getPointAt(this.currentT);
    this.seal.group.position.copy(pos);

    // Update kinetic micro-rotations
    this.seal.update(delta);

    this.renderer.render(this.scene, this.camera);
  };

  private onResize = (): void => {
    if (!this.renderer || !this.camera || !this.seal) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Recompute path and traveler scale for new viewport
    const isMobile = width < 768;
    this.curve = createTravelPath(isMobile);

    const scale = getTravelerScale(width);
    this.seal.group.scale.set(scale, scale, scale);

    const pos = this.curve.getPointAt(this.currentT);
    this.seal.group.position.copy(pos);
  };

  private setupObserver(): void {
    if (!('IntersectionObserver' in window) || !this.canvas) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        this.isPaused = !entry.isIntersecting;
      });
    }, { threshold: 0 });

    this.observer.observe(this.canvas);
  }

  private mountFallback(): void {
    this.fallback = new FallbackRenderer();
    const heroBlock = document.querySelector('.hero-block');
    if (heroBlock instanceof HTMLElement) {
      this.fallback.mount(heroBlock);
    }
  }

  private isWebGLAvailable(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  }

  /**
   * Complete memory disposal of Three.js assets
   */
  public dispose(): void {
    this.isRunning = false;
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }

    window.removeEventListener('resize', this.onResize);
    this.observer?.disconnect();

    this.seal?.dispose();
    this.renderer?.dispose();

    if (this.canvas && this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }

    this.fallback?.unmount();

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.seal = null;
    this.canvas = null;
  }
}
