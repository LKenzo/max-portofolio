import {
  Group,
  Mesh,
  SphereGeometry,
  OctahedronGeometry,
  TorusGeometry,
  MeshStandardMaterial,
  MeshBasicMaterial,
} from 'three';

/**
 * PROCEDURAL 3D CRYPTOGRAPHIC EVIDENCE SEAL (EVIDENCE LOCKER PALETTE)
 *
 * Built entirely with procedural Three.js geometry (0 kB external asset load).
 * Palette tuned strictly to Evidence Locker:
 * - Indigo metal base (metalness: 0.9, roughness: 0.2)
 * - Manila document accents (color: 0xe8dfd1)
 * - UV violet glow core & emissive rings (color: 0xa855f7)
 * - Zero cyan, zero blue, zero green
 */

export class EvidenceSeal {
  public readonly group: Group;
  private readonly core: Mesh;
  private readonly prism: Mesh;
  private readonly wireframe: Mesh;
  private readonly innerRing: Mesh;
  private readonly outerRing: Mesh;

  constructor() {
    this.group = new Group();

    // 1. Emissive UV Violet Inner Core
    const coreGeo = new SphereGeometry(0.42, 24, 24);
    const coreMat = new MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0xa855f7,
      emissiveIntensity: 1.1,
      roughness: 0.2,
      metalness: 0.4,
    });
    this.core = new Mesh(coreGeo, coreMat);
    this.group.add(this.core);

    // 2. Faceted Octahedron Prism (Deep Indigo Metal)
    const prismGeo = new OctahedronGeometry(1.15, 0);
    const prismMat = new MeshStandardMaterial({
      color: 0x121826,
      metalness: 0.9,
      roughness: 0.18,
      transparent: true,
      opacity: 0.88,
    });
    this.prism = new Mesh(prismGeo, prismMat);
    this.group.add(this.prism);

    // 3. Facet Wireframe Contour (Document Manila Accent)
    const wireGeo = new OctahedronGeometry(1.16, 0);
    const wireMat = new MeshBasicMaterial({
      color: 0xe8dfd1,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    this.wireframe = new Mesh(wireGeo, wireMat);
    this.group.add(this.wireframe);

    // 4. Inner Orbital Ring (Indigo Metal with Manila Emissive Accent)
    const innerRingGeo = new TorusGeometry(1.6, 0.025, 16, 64);
    const innerRingMat = new MeshStandardMaterial({
      color: 0x1a2234,
      emissive: 0xe8dfd1,
      emissiveIntensity: 0.35,
      metalness: 0.9,
      roughness: 0.2,
    });
    this.innerRing = new Mesh(innerRingGeo, innerRingMat);
    this.innerRing.rotation.x = Math.PI / 4;
    this.group.add(this.innerRing);

    // 5. Outer Orbital Ring (UV Violet Accent Ring)
    const outerRingGeo = new TorusGeometry(2.05, 0.02, 16, 64);
    const outerRingMat = new MeshStandardMaterial({
      color: 0x2e1065,
      emissive: 0xa855f7,
      emissiveIntensity: 0.55,
      metalness: 0.85,
      roughness: 0.25,
    });
    this.outerRing = new Mesh(outerRingGeo, outerRingMat);
    this.outerRing.rotation.y = Math.PI / 3;
    this.group.add(this.outerRing);
  }

  /**
   * Continuous micro-rotation for procedural kinetic presence
   */
  public update(delta: number): void {
    // Core subtle pulse
    this.prism.rotation.y += delta * 0.4;
    this.prism.rotation.x += delta * 0.15;
    this.wireframe.rotation.copy(this.prism.rotation);

    // Counter-rotating orbital rings
    this.innerRing.rotation.x += delta * 0.7;
    this.innerRing.rotation.z += delta * 0.5;

    this.outerRing.rotation.y -= delta * 0.5;
    this.outerRing.rotation.z -= delta * 0.3;
  }

  /**
   * Complete memory cleanup
   */
  public dispose(): void {
    this.group.traverse((obj) => {
      if (obj instanceof Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
  }
}
