import * as THREE from 'three';

export class ThreeHeroScene {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.mesh = null;
    this.sculpture = null;
    this.corePoly = null;
    this.rings = [];
    this.ambientParticles = null;

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.manualRotationX = 0;
    this.manualRotationY = 0;

    this.clock = new THREE.Clock();
    this.animationFrameId = null;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene Setup
    this.scene = new THREE.Scene();

    // 2. Camera Setup
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    this.camera.position.set(0, 1.2, 13);

    // 3. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting for rich depth
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x38bdf8, 2.5, 30);
    pointLight1.position.set(8, 6, 8);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x818cf8, 2, 30);
    pointLight2.position.set(-8, -4, 6);
    this.scene.add(pointLight2);

    // 5. Build 3D Sculptural Elements
    this.createOrganicFluidMesh();
    this.createParametricSculpture();
    this.createAmbientDust();

    // 6. Setup Interaction Events
    this.setupEvents();

    // 7. Start Loop
    this.animate();
  }

  createOrganicFluidMesh() {
    // Dynamic undulating topographical grid
    const geometry = new THREE.PlaneGeometry(36, 24, 72, 48);
    const vertexCount = geometry.attributes.position.count;
    const originalPositions = new Float32Array(geometry.attributes.position.array);

    geometry.userData = { originalPositions };

    const material = new THREE.MeshBasicMaterial({
      color: 0x4f46e5,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2.7;
    this.mesh.position.set(0, -3.8, -1);
    this.scene.add(this.mesh);
  }

  createParametricSculpture() {
    this.sculptureGroup = new THREE.Group();
    this.sculptureGroup.position.set(0, 1.0, 0);

    // 1. Outer Torus Knot Ribbon
    const knotGeo = new THREE.TorusKnotGeometry(2.6, 0.45, 160, 32, 2, 3);
    const knotMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.32
    });
    this.sculpture = new THREE.Mesh(knotGeo, knotMat);
    this.sculptureGroup.add(this.sculpture);

    // 2. Inner Floating Geometric Polyhedron (Icosahedron core)
    const icoGeo = new THREE.IcosahedronGeometry(1.3, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    this.corePoly = new THREE.Mesh(icoGeo, icoMat);
    this.sculptureGroup.add(this.corePoly);

    // 3. Orbital Precision Rings
    const ringConfigs = [
      { radius: 3.8, color: 0x38bdf8, rotX: Math.PI / 3, rotY: 0 },
      { radius: 4.2, color: 0xc084fc, rotX: -Math.PI / 4, rotY: Math.PI / 6 }
    ];

    ringConfigs.forEach(cfg => {
      const ringGeo = new THREE.RingGeometry(cfg.radius, cfg.radius + 0.04, 80);
      const ringMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = cfg.rotX;
      ring.rotation.y = cfg.rotY;
      this.rings.push(ring);
      this.sculptureGroup.add(ring);
    });

    this.scene.add(this.sculptureGroup);
  }

  createAmbientDust() {
    const count = 220;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 40;
      pos[i + 1] = (Math.random() - 0.5) * 26;
      pos[i + 2] = (Math.random() - 0.5) * 24;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xe0e7ff,
      size: 0.18,
      transparent: true,
      opacity: 0.6
    });

    this.ambientParticles = new THREE.Points(geo, mat);
    this.scene.add(this.ambientParticles);
  }

  setupEvents() {
    // Mouse movement parallax
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Touch & Mouse Drag Rotation for direct interaction
    const dom = this.renderer.domElement;

    dom.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.manualRotationY += deltaX * 0.005;
      this.manualRotationX += deltaY * 0.005;

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Window Resize
    window.addEventListener('resize', () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });

    // Scroll Parallax
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (this.camera) {
        this.camera.position.y = 1.2 - scrollY * 0.0025;
      }
    });
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const t = this.clock.getElapsedTime();

    // Smooth cursor interpolation
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // 1. Animate Parametric Sculpture
    if (this.sculptureGroup) {
      this.sculptureGroup.rotation.y = t * 0.22 + this.mouseX * 0.4 + this.manualRotationY;
      this.sculptureGroup.rotation.x = Math.sin(t * 0.18) * 0.15 - this.mouseY * 0.3 + this.manualRotationX;
      this.sculptureGroup.rotation.z = Math.cos(t * 0.15) * 0.08;

      // Slight breathing scale
      const breath = 1 + Math.sin(t * 1.5) * 0.03;
      this.sculptureGroup.scale.set(breath, breath, breath);
    }

    if (this.sculpture) {
      this.sculpture.rotation.y = -t * 0.15;
    }

    if (this.corePoly) {
      this.corePoly.rotation.x = t * 0.4;
      this.corePoly.rotation.y = t * 0.5;
    }

    this.rings.forEach((ring, idx) => {
      ring.rotation.z = t * (0.2 + idx * 0.1) * (idx % 2 === 0 ? 1 : -1);
    });

    // 2. Animate Undulating Wave Surface
    if (this.mesh && this.mesh.geometry.userData.originalPositions) {
      const positions = this.mesh.geometry.attributes.position.array;
      const orig = this.mesh.geometry.userData.originalPositions;

      for (let i = 0; i < positions.length; i += 3) {
        const x = orig[i];
        const y = orig[i + 1];
        // Mathematical sine wave equation with spatial ripple
        const wave = Math.sin(x * 0.25 + t * 1.2) * Math.cos(y * 0.3 + t * 0.8) * 1.1;
        const pointerDist = Math.hypot(x - this.mouseX * 10, y - this.mouseY * 6);
        const mouseRipple = Math.sin(pointerDist * 0.5 - t * 2.0) * 0.35 * Math.exp(-pointerDist * 0.1);

        positions[i + 2] = orig[i + 2] + wave + mouseRipple;
      }
      this.mesh.geometry.attributes.position.needsUpdate = true;
    }

    // 3. Animate Ambient Dust
    if (this.ambientParticles) {
      this.ambientParticles.rotation.y = t * 0.04;
      this.ambientParticles.rotation.x = t * 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
      this.renderer.dispose();
    }
  }
}
