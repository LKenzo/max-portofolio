/**
 * STATIC ACCESSIBILITY FALLBACK
 *
 * Rendered when:
 * 1. User has enabled prefers-reduced-motion: reduce
 * 2. Browser or device does not support WebGL
 */

export class FallbackRenderer {
  private container: HTMLElement | null = null;

  public mount(target: HTMLElement): void {
    this.container = target;
    this.container.innerHTML = `
      <div class="static-seal-fallback" aria-label="Cryptographic Evidence Seal Vector" style="
        width: 180px;
        height: 180px;
        position: relative;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      ">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
          <circle cx="50" cy="50" r="46" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.6"/>
          <circle cx="50" cy="50" r="38" stroke="#10b981" stroke-width="1" opacity="0.4"/>
          <polygon points="50,15 85,50 50,85 15,50" stroke="#00f0ff" stroke-width="2" fill="#0d1422" fill-opacity="0.8"/>
          <circle cx="50" cy="50" r="8" fill="#00f0ff"/>
        </svg>
      </div>
    `;
  }

  public unmount(): void {
    if (this.container) {
      this.container.innerHTML = '';
      this.container = null;
    }
  }
}
