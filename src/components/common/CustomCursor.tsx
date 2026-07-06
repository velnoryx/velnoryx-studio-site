import { useEffect, useRef, useState } from 'react';

const COLORS = {
  saffron: '#FF9933',
  white: '#FFFFFF',
  green: '#138808',
  gold: '#FFD700',
};

// Lerp helper
const lerp = (start: number, end: number, amt: number) => {
  return (1 - amt) * start + amt * end;
};

// Particle class
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;

  constructor(x: number, y: number, color: string, vx: number, vy: number, life: number = 1, size: number = 2) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxLife = life;
    this.size = size;
    this.color = color;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.1;
  }

  update(dt: number) {
    this.x += this.vx * dt * 60;
    this.y += this.vy * dt * 60;
    this.life -= dt;
    this.rotation += this.rotationSpeed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.life <= 0) return;
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = alpha;
    
    // Soft bloom
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Color interpolation
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 255, b: 255 };
};

const lerpColor = (color1: string, color2: string, amt: number) => {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const r = Math.round(lerp(c1.r, c2.r, amt));
  const g = Math.round(lerp(c1.g, c2.g, amt));
  const b = Math.round(lerp(c1.b, c2.b, amt));
  return `rgb(${r},${g},${b})`;
};

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  const mouse = useRef({ x: -100, y: -100 });
  const trailMouse = useRef({ x: -100, y: -100 });
  
  const state = useRef({
    hoverType: 'none', // none, nav, button, globe, map, card, hero
    isClicking: false,
    isIdle: false,
    scrollSpeed: 0,
    lastScrollY: 0,
    idleTimer: 0
  });

  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (mediaQuery.matches && !motionQuery.matches) {
      setEnabled(true);
    }

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setEnabled(e.matches && !motionQuery.matches);
    };
    
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', onResize);

    state.current.lastScrollY = window.scrollY;
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - state.current.lastScrollY);
      state.current.scrollSpeed = Math.min(delta * 0.1, 5);
      state.current.lastScrollY = currentScrollY;
      state.current.isIdle = false;
      state.current.idleTimer = 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      state.current.isIdle = false;
      state.current.idleTimer = 0;
    };

    const spawnParticles = (count: number, isBurst = false) => {
      for (let i = 0; i < count; i++) {
        if (particles.current.length > 150) break;
        
        const angle = Math.random() * Math.PI * 2;
        let speed = Math.random() * 1.5 + 0.5;
        if (isBurst) speed = Math.random() * 4 + 2;
        
        const rand = Math.random();
        let color = COLORS.gold;
        if (rand > 0.9) color = COLORS.saffron;
        else if (rand > 0.8) color = COLORS.white;
        else if (rand > 0.7) color = COLORS.green;

        let vx = Math.cos(angle) * speed;
        let vy = Math.sin(angle) * speed;
        let life = 0.8 + Math.random() * 0.4;
        let size = 1 + Math.random() * 1.5;

        // Special physics for Hero Ribbon
        if (!isBurst && state.current.hoverType === 'hero') {
          vx = (trailMouse.current.x - mouse.current.x) * 0.05 + (Math.random() - 0.5);
          vy = (trailMouse.current.y - mouse.current.y) * 0.05 + (Math.random() - 0.5);
          life = 1.2 + Math.random() * 0.6;
        }

        particles.current.push(new Particle(
          mouse.current.x + (Math.random() - 0.5) * 8,
          mouse.current.y + (Math.random() - 0.5) * 8,
          color, vx, vy, life, size
        ));
      }
    };

    const onMouseDown = () => {
      state.current.isClicking = true;
      spawnParticles(30, true);
    };

    const onMouseUp = () => {
      state.current.isClicking = false;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      let hoverType = 'none';

      if (target.closest('section[data-section="0"]')) {
        hoverType = 'hero';
      }
      
      if (target.closest('.glassmorphism')) {
        hoverType = 'card';
      }

      if (target.tagName === 'path' && target.closest('svg')) {
        hoverType = 'map';
      }

      if (target.tagName === 'A' || target.closest('a')) {
        hoverType = 'nav';
      }
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        hoverType = 'button';
      }
      
      if (target.closest('section[data-section="10"]')) {
        hoverType = 'globe';
      }

      state.current.hoverType = hoverType;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', onMouseOver);

    let animationFrameId: number;
    let lastTime = performance.now();
    let ringColorTime = 0;

    const ringColors = [COLORS.saffron, COLORS.white, COLORS.green];

    const tick = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Smooth trail
      const lerpFactor = state.current.hoverType === 'button' ? 0.05 : 0.2;
      trailMouse.current.x = lerp(trailMouse.current.x, mouse.current.x, lerpFactor);
      trailMouse.current.y = lerp(trailMouse.current.y, mouse.current.y, lerpFactor);

      // Idle logic
      state.current.idleTimer += dt;
      if (state.current.idleTimer > 2) {
        state.current.isIdle = true;
      }

      // Scroll decay
      state.current.scrollSpeed = lerp(state.current.scrollSpeed, 0, 0.1);

      // Smooth Ring Color Transition (2-3 seconds)
      ringColorTime += dt * 0.4;
      const colorIndex = Math.floor(ringColorTime) % ringColors.length;
      const nextColorIndex = (colorIndex + 1) % ringColors.length;
      const colorLerpAmt = ringColorTime % 1;
      const currentRingColor = lerpColor(ringColors[colorIndex], ringColors[nextColorIndex], colorLerpAmt);
      
      const dist = Math.hypot(mouse.current.x - trailMouse.current.x, mouse.current.y - trailMouse.current.y);
      
      if ((dist > 2 || state.current.scrollSpeed > 1) && !state.current.isIdle) {
        let spawnCount = Math.floor(dist * 0.1) + Math.floor(state.current.scrollSpeed);
        spawnCount = Math.min(spawnCount, 3);
        spawnParticles(spawnCount);
      }

      // Idle orbits
      if (state.current.isIdle && Math.random() < 0.04 && particles.current.length < 40) {
        const angle = time * 0.001;
        particles.current.push(new Particle(
          mouse.current.x + Math.cos(angle) * 15,
          mouse.current.y + Math.sin(angle) * 15,
          Math.random() > 0.5 ? COLORS.gold : ringColors[colorIndex],
          Math.cos(angle + Math.PI/2) * 0.3,
          Math.sin(angle + Math.PI/2) * 0.3,
          1.5, 1
        ));
      }

      // Update & Draw particles
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.update(dt);
        p.draw(ctx);
        if (p.life <= 0) particles.current.splice(i, 1);
      }

      // Draw Main Dot
      ctx.save();
      ctx.translate(mouse.current.x, mouse.current.y);
      let dotScale = state.current.isClicking ? 0.6 : 1;
      if (state.current.isIdle) dotScale = 1 + Math.sin(time * 0.002) * 0.2;
      ctx.scale(dotScale, dotScale);
      
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.gold;
      ctx.shadowBlur = 12;
      ctx.shadowColor = COLORS.gold;
      ctx.fill();
      ctx.restore();

      // Draw Outer Ring
      ctx.save();
      ctx.translate(trailMouse.current.x, trailMouse.current.y);
      
      let ringScale = state.current.isClicking ? 0.7 : 1;
      let ringAlpha = 0.5;

      if (state.current.hoverType === 'nav') {
        ringScale = 1.4;
        ringAlpha = 0.8;
        ctx.strokeStyle = COLORS.saffron;
        ctx.shadowColor = COLORS.saffron;
      } else if (state.current.hoverType === 'button') {
        ringScale = 1.6;
        ringAlpha = 0.9;
        ctx.strokeStyle = currentRingColor;
        ctx.shadowColor = currentRingColor;
      } else if (state.current.hoverType === 'card') {
        ringScale = 1.2;
        ringAlpha = 0.6;
        ctx.strokeStyle = COLORS.gold;
        ctx.shadowColor = COLORS.gold;
      } else if (state.current.hoverType === 'globe') {
        ringScale = 1.8;
        ringAlpha = 0.4;
        ctx.strokeStyle = currentRingColor;
        ctx.shadowColor = currentRingColor;
        ctx.rotate(time * 0.001); // Rotating Ashoka Chakra inspired
        ctx.setLineDash([4, 4]);
      } else {
        ctx.strokeStyle = currentRingColor;
        ctx.shadowColor = currentRingColor;
      }

      if (state.current.isIdle) {
        ringScale *= (1 + Math.sin(time * 0.002) * 0.1);
      }

      ctx.scale(ringScale, ringScale);
      ctx.globalAlpha = ringAlpha;
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.lineWidth = 1.2;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
