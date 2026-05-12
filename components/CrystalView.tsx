import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * A floating fractured ice crystal rendered with three.js. Each instance gets
 * a slightly different shape and hue so portfolio cards feel like unique
 * specimens carved from a frozen archive.
 */
export const CrystalView: React.FC<{ hue?: number; seed?: number }> = ({ hue = 210, seed = 1 }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Lights
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(2, 3, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(new THREE.Color(`hsl(${hue}, 60%, 70%)`), 0.9);
    rim.position.set(-3, -1, -2);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0xb6c7d6, 0.6));

    // Deterministic pseudo-random
    let s = seed;
    const rnd = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };

    // Build an irregular ice shard from an icosahedron with vertex displacement.
    const geo = new THREE.IcosahedronGeometry(1.05, 1);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const n = (rnd() - 0.5) * 0.55;
      pos.setXYZ(i, x + n * x * 0.6, y * 1.25 + n, z + n * z * 0.6);
    }
    geo.computeVertexNormals();

    const color = new THREE.Color(`hsl(${hue}, 30%, 78%)`);

    const mat = new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.2,
      roughness: 0.35,
      transmission: 0.35,
      thickness: 0.8,
      clearcoat: 0.6,
      clearcoatRoughness: 0.4,
      reflectivity: 0.6,
      flatShading: true,
      ior: 1.4
    });

    const crystal = new THREE.Mesh(geo, mat);
    scene.add(crystal);

    // Wireframe overlay for hi-tech feel
    const wire = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo, 25),
      new THREE.LineBasicMaterial({ color: 0xe6eef5, transparent: true, opacity: 0.18 })
    );
    crystal.add(wire);

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
    let mouseY = 0, mouseX = 0;
    const onMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    mount.addEventListener('pointermove', onMove);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      crystal.rotation.y += 0.004;
      crystal.rotation.x = Math.sin(t * 0.4) * 0.12 + mouseY * 0.25;
      crystal.rotation.z = mouseX * 0.15;
      crystal.position.y = Math.sin(t * 0.8) * 0.08;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      mount.removeEventListener('pointermove', onMove);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [hue, seed]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
};
