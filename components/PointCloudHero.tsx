import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * A reactive point-cloud "frozen avatar". Renders ~12k particles distributed
 * across a stylised humanoid silhouette, then gently breathes and reacts to
 * pointer movement. No external GLTF assets — fully procedural so it boots
 * instantly on any device.
 */
export const PointCloudHero: React.FC<{ paused?: boolean }> = ({ paused = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Generate humanoid silhouette via several blobs (head, body, arms, base).
    const positions: number[] = [];
    const colors: number[] = [];
    const offsets: number[] = []; // animation phase per point

    const pushBlob = (
      cx: number, cy: number, cz: number,
      rx: number, ry: number, rz: number,
      count: number
    ) => {
      for (let i = 0; i < count; i++) {
        // sample inside ellipsoid
        let x = 0, y = 0, z = 0;
        do {
          x = (Math.random() * 2 - 1);
          y = (Math.random() * 2 - 1);
          z = (Math.random() * 2 - 1);
        } while (x * x + y * y + z * z > 1);

        positions.push(cx + x * rx, cy + y * ry, cz + z * rz);

        const brightness = 0.55 + Math.random() * 0.45;
        colors.push(brightness, brightness, brightness + 0.05);
        offsets.push(Math.random() * Math.PI * 2);
      }
    };

    // Head
    pushBlob(0, 1.35, 0, 0.62, 0.7, 0.6, 2200);
    // little tuft
    pushBlob(0.05, 2.1, 0.05, 0.08, 0.18, 0.08, 250);
    // Body (egg-shape)
    pushBlob(0, 0.05, 0, 0.85, 1.05, 0.8, 5200);
    // Right arm/flipper
    pushBlob(0.78, 0.05, 0, 0.18, 0.45, 0.22, 700);
    // Left arm/flipper
    pushBlob(-0.78, 0.05, 0, 0.18, 0.45, 0.22, 700);
    // Feet
    pushBlob(-0.25, -1.1, 0.05, 0.18, 0.1, 0.28, 350);
    pushBlob(0.25, -1.1, 0.05, 0.18, 0.1, 0.28, 350);
    // Ambient surrounding dust
    pushBlob(0, 0.1, 0, 2.4, 2.4, 2.4, 1500);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('aOffset', new THREE.Float32BufferAttribute(offsets, 1));

    // Custom shader for soft round particles
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 8.0 * renderer.getPixelRatio() },
        uPointer: { value: new THREE.Vector2(0, 0) }
      },
      vertexShader: `
        attribute float aOffset;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uSize;
        uniform vec2 uPointer;
        void main() {
          vColor = color;
          vec3 pos = position;
          // breathing
          float breath = sin(uTime * 0.8 + aOffset) * 0.018;
          pos += normalize(pos + vec3(0.001)) * breath;
          // pointer parallax
          pos.x += uPointer.x * 0.25 * (1.0 + pos.y * 0.3);
          pos.y += uPointer.y * 0.25 * (1.0 + abs(pos.x) * 0.3);
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = uSize * (1.0 / -mvPosition.z);
          vAlpha = 0.85 - clamp((-mvPosition.z - 4.0) * 0.15, 0.0, 0.6);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.15, d) * vAlpha;
          gl_FragColor = vec4(vColor, a);
        }
      `,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    const points = new THREE.Points(geometry, material);
    points.rotation.y = -0.2;
    scene.add(points);

    // Subtle ground ring (wireframe)
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.0, 0.012, 8, 96),
      new THREE.MeshBasicMaterial({ color: 0xc7d6e2, transparent: true, opacity: 0.25 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.5;
    scene.add(ring);

    // Pointer
    const pointer = new THREE.Vector2(0, 0);
    const onMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove);

    // Resize
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    let raf = 0;
    const clock = new THREE.Clock();
    let targetPointer = new THREE.Vector2();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (pausedRef.current) return;
      const t = clock.getElapsedTime();
      material.uniforms.uTime.value = t;
      targetPointer.lerp(pointer, 0.05);
      material.uniforms.uPointer.value.copy(targetPointer);
      points.rotation.y = -0.2 + Math.sin(t * 0.2) * 0.25 + targetPointer.x * 0.4;
      points.rotation.x = targetPointer.y * 0.2;
      ring.rotation.z = t * 0.1;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
};
