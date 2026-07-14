import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Procedural igloo built from instanced bricks arranged on a dome — calmly
 * rotating, lit by a soft moon-key light. The "structure" theme reinforces
 * the "we build" manifesto sitting next to it.
 */
export const IglooScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(3.6, 1.4, 4.6);
    camera.lookAt(0, 0.6, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0x8ea0b0, 0.55));
    const moon = new THREE.DirectionalLight(0xe6eef5, 1.4);
    moon.position.set(5, 8, 3);
    scene.add(moon);
    const cold = new THREE.PointLight(0x8fb6d8, 1.2, 12);
    cold.position.set(-2, 1, 3);
    scene.add(cold);

    const igloo = new THREE.Group();
    scene.add(igloo);

    // ground disc
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(3.6, 64),
      new THREE.MeshStandardMaterial({ color: 0x1c2530, roughness: 1, metalness: 0 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    scene.add(ground);

    // Build brick rings
    const brickMat = new THREE.MeshStandardMaterial({
      color: 0xcdd6e0,
      roughness: 0.75,
      metalness: 0.05
    });
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xe6eef5, transparent: true, opacity: 0.18 });

    const rings = 6;
    const baseRadius = 1.5;
    for (let r = 0; r < rings; r++) {
      const fraction = r / (rings - 1);
      const ringRadius = baseRadius * Math.sqrt(1 - fraction * fraction * 0.95);
      const ringHeight = fraction * 1.55;
      const segments = Math.max(6, Math.floor(16 * (1 - fraction * 0.4)));
      const brickW = (Math.PI * 2 * ringRadius) / segments * 0.95;
      const brickH = 0.26;
      const brickD = 0.22;

      const geom = new THREE.BoxGeometry(brickW, brickH, brickD);
      for (let i = 0; i < segments; i++) {
        const a = (i / segments) * Math.PI * 2 + (r % 2 === 0 ? 0 : Math.PI / segments);
        const x = Math.cos(a) * ringRadius;
        const z = Math.sin(a) * ringRadius;
        const brick = new THREE.Mesh(geom, brickMat);
        brick.position.set(x, ringHeight, z);
        brick.lookAt(0, ringHeight, 0);
        // small random tilt
        brick.rotation.z += (Math.random() - 0.5) * 0.04;
        igloo.add(brick);

        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geom), edgeMat);
        edges.position.copy(brick.position);
        edges.rotation.copy(brick.rotation);
        igloo.add(edges);
      }
    }

    // Entrance arch (cut shape)
    const arch = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.7, 0.45),
      new THREE.MeshStandardMaterial({ color: 0x070a0f })
    );
    arch.position.set(0, 0.32, 1.45);
    igloo.add(arch);

    // Glow ring base
    const baseRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.55, 0.02, 12, 80),
      new THREE.MeshBasicMaterial({ color: 0xe6eef5, transparent: true, opacity: 0.35 })
    );
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = 0.01;
    scene.add(baseRing);

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
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      igloo.rotation.y = t * 0.12;
      baseRing.rotation.z = t * 0.2;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
};
