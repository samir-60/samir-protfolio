import * as THREE from 'three';
import { skillsData } from '../data/skills.js';

export class ThreeSkillsGalaxy {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.group = null;
    this.tags = [];
    this.isDragging = false;
    this.prevMousePos = { x: 0, y: 0 };
    this.rotationVelocity = { x: 0.002, y: 0.003 };

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 500;
    const height = this.container.clientHeight || 450;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.z = 24;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Inner orbital rings
    this.createOrbitalRings();

    // Create 3D Text Sprites for Skills
    this.createSkillSprites();

    // Setup interactive drag & touch
    this.setupInteractivity();

    // Start Animation
    this.animate();
  }

  createOrbitalRings() {
    const rings = [
      { radius: 6.5, color: 0x38bdf8, rotX: Math.PI / 4, rotY: 0 },
      { radius: 8.5, color: 0x818cf8, rotX: -Math.PI / 3, rotY: Math.PI / 6 },
      { radius: 10.2, color: 0xc084fc, rotX: Math.PI / 6, rotY: -Math.PI / 4 }
    ];

    rings.forEach(({ radius, color, rotX, rotY }) => {
      const geo = new THREE.TorusGeometry(radius, 0.02, 16, 100);
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.set(rotX, rotY, 0);
      this.group.add(mesh);
    });

    // Central glowing core point
    const coreGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    this.group.add(new THREE.Mesh(coreGeo, coreMat));
  }

  createSkillSprites() {
    const tagList = skillsData.cloudSphereTags;
    const count = tagList.length;
    const radius = 9.5;

    // Golden spiral distribution on sphere
    const phi = Math.PI * (3 - Math.sqrt(5)); // ~2.39996323

    tagList.forEach((tag, i) => {
      const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Render Canvas Text Sprite
      const sprite = this.makeTextSprite(tag.text, tag.color, tag.weight);
      sprite.position.set(x * radius, y * radius, z * radius);
      sprite.userData = { originalScale: sprite.scale.clone() };

      this.tags.push(sprite);
      this.group.add(sprite);
    });
  }

  makeTextSprite(message, colorStr, weight = 1.0) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Background pill badge
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.strokeStyle = colorStr || '#38bdf8';
    ctx.lineWidth = 2;
    
    // Rounded rect
    const r = 16;
    ctx.beginPath();
    ctx.moveTo(r, 6);
    ctx.lineTo(256 - r, 6);
    ctx.quadraticCurveTo(256, 6, 256, 6 + r);
    ctx.lineTo(256, 58 - r);
    ctx.quadraticCurveTo(256, 58, 256 - r, 58);
    ctx.lineTo(r, 58);
    ctx.quadraticCurveTo(0, 58, 0, 58 - r);
    ctx.lineTo(0, 6 + r);
    ctx.quadraticCurveTo(0, 6, r, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.font = 'bold 22px "Plus Jakarta Sans", "Inter", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(message, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.95,
      depthTest: false
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(4.2 * weight, 1.05 * weight, 1.0);
    return sprite;
  }

  setupInteractivity() {
    const dom = this.renderer.domElement;

    dom.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.prevMousePos.x;
        const deltaY = e.clientY - this.prevMousePos.y;

        this.rotationVelocity.y = deltaX * 0.005;
        this.rotationVelocity.x = deltaY * 0.005;

        this.group.rotation.y += this.rotationVelocity.y;
        this.group.rotation.x += this.rotationVelocity.x;

        this.prevMousePos = { x: e.clientX, y: e.clientY };
      }
    });

    // Touch support for mobile
    dom.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - this.prevMousePos.x;
        const deltaY = e.touches[0].clientY - this.prevMousePos.y;

        this.rotationVelocity.y = deltaX * 0.005;
        this.rotationVelocity.x = deltaY * 0.005;

        this.group.rotation.y += this.rotationVelocity.y;
        this.group.rotation.x += this.rotationVelocity.x;

        this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    // Resize Handler
    window.addEventListener('resize', () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const width = this.container.clientWidth || 500;
      const height = this.container.clientHeight || 450;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.isDragging) {
      // Natural idle momentum
      this.rotationVelocity.y *= 0.96;
      this.rotationVelocity.x *= 0.96;

      // Base rotation
      this.group.rotation.y += 0.003 + this.rotationVelocity.y;
      this.group.rotation.x += 0.0015 + this.rotationVelocity.x;
    }

    // Dynamic scale and opacity depending on distance to camera (Z-depth)
    this.tags.forEach((sprite) => {
      // Get world position of sprite
      const worldPos = new THREE.Vector3();
      sprite.getWorldPosition(worldPos);
      const dist = this.camera.position.distanceTo(worldPos);

      // Sprites closer to camera are brighter and larger
      const scaleFactor = Math.max(0.7, Math.min(1.25, 24 / dist));
      sprite.scale.x = sprite.userData.originalScale.x * scaleFactor;
      sprite.scale.y = sprite.userData.originalScale.y * scaleFactor;
      sprite.material.opacity = Math.max(0.4, Math.min(1.0, 1.3 - (dist - 14) / 18));
    });

    this.renderer.render(this.scene, this.camera);
  }
}
