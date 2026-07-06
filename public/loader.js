// Cinematic Splash Loader JS
(function () {
  // 1. Accessibility & Reduced Motion check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Announce for screen readers
  const loaderEl = document.createElement('div');
  loaderEl.id = 'velnoryx-loader';
  loaderEl.setAttribute('role', 'status');
  loaderEl.setAttribute('aria-live', 'polite');
  loaderEl.innerHTML = `
    <span class="sr-only" style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0;">
      Loading VELNORYX STUDIO...
    </span>
    <canvas id="velnoryx-canvas"></canvas>
  `;
  document.body.appendChild(loaderEl);

  const canvas = document.getElementById('velnoryx-canvas');
  const ctx = canvas.getContext('2d');

  let canvasWidth = window.innerWidth;
  let canvasHeight = window.innerHeight;

  // High-DPI Canvas Scaling Handler
  const handleResize = () => {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
    ctx.scale(dpr, dpr);
  };
  window.addEventListener('resize', handleResize);
  handleResize();

  // Track page assets load state
  let assetsLoaded = false;
  window.addEventListener('load', () => {
    assetsLoaded = true;
  });

  // Cap fallback load at 8 seconds
  let forceStartExit = false;
  const loadTimeout = setTimeout(() => {
    forceStartExit = true;
  }, 8000);

  // Load logo images
  let loadedCount = 0;
  const monogramImg = new Image();
  monogramImg.src = '/logo_monogram_trimmed.png';
  
  const textImg = new Image();
  textImg.src = '/logo_text_trimmed.png';

  // Wait for both images and custom fonts (Cinzel, Outfit) to be ready
  const checkLoad = () => {
    loadedCount++;
    if (loadedCount === 2) {
      document.fonts.ready.then(() => {
        if (prefersReducedMotion) {
          runReducedMotionIntro(monogramImg, textImg);
        } else {
          runCinematicIntro(monogramImg, textImg);
        }
      });
    }
  };

  monogramImg.onload = checkLoad;
  textImg.onload = checkLoad;

  // Easing Functions
  function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }

  // ─── Self-Contained 2D Perlin Noise ──────────────────────────────────────────
  const PerlinNoise = (function() {
    const p = new Uint8Array(512);
    const source = [
      151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
      190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,
      136,171,168, 68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,
      46,245,40,244,102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,135,130,116,188,159,
      86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,
      58,17,182,189,28,42,223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,129,22,39,253,
      19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,
      235,249,14,239,107,49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,138,236,205,93,222,
      114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
    ];
    for (let i = 0; i < 256; i++) {
      p[i] = source[i];
      p[256 + i] = source[i];
    }

    function fade(t) {
      return t * t * t * (t * (t * 6 - 15) + 10);
    }

    function lerp(t, a, b) {
      return a + t * (b - a);
    }

    function grad(hash, x, y) {
      const h = hash & 7;
      const u = h < 4 ? x : y;
      const v = h < 4 ? y : x;
      return ((h & 1) ? -u : u) + ((h & 2) ? -2.0 * v : 2.0 * v);
    }

    return {
      noise2D(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const xf = x - Math.floor(x);
        const yf = y - Math.floor(y);
        const u = fade(xf);
        const v = fade(yf);
        const aa = p[p[X] + Y];
        const ab = p[p[X] + Y + 1];
        const ba = p[p[X + 1] + Y];
        const bb = p[p[X + 1] + Y + 1];

        const x1 = lerp(u, grad(aa, xf, yf), grad(ba, xf - 1, yf));
        const x2 = lerp(u, grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1));
        return lerp(v, x1, x2);
      }
    };
  })();

  // ─── Offscreen Canvas Particle Sprite Pre-renderer ─────────────────────────
  const dustSprites = [];
  function initDustSprites() {
    const spriteColors = [
      { main: '#FFD700', core: '#FFFFFF' }, // Gold dust
      { main: '#FFF8E7', core: '#FFFFFF' }  // White/Cream dust
    ];

    // Generate sprites for 5 sizes: 2px, 4px, 8px, 16px, 32px (diameter)
    for (let c = 0; c < 2; c++) {
      const color = spriteColors[c];
      const sizes = [2, 4, 8, 16, 32];
      
      sizes.forEach((s) => {
        const spriteCanvas = document.createElement('canvas');
        spriteCanvas.width = s * 2; // Add padding for radial blur
        spriteCanvas.height = s * 2;
        const sCtx = spriteCanvas.getContext('2d');
        const cx = s;
        const cy = s;
        const r = s;

        const grad = sCtx.createRadialGradient(cx, cy, 0, cx, cy, r);
        if (s >= 16) {
          // Volumetric camera bokeh disc style (sharp rim, flat glowing body, soft falloff)
          grad.addColorStop(0, hexToRgbA(color.main, 1.0));
          grad.addColorStop(0.65, hexToRgbA(color.main, 0.8));
          grad.addColorStop(0.85, hexToRgbA(color.main, 0.3));
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else if (s === 8) {
          // Standard soft glowing dust
          grad.addColorStop(0, color.core);
          grad.addColorStop(0.25, color.main);
          grad.addColorStop(0.6, hexToRgbA(color.main, 0.4));
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          // Tiny sharp spark
          grad.addColorStop(0, '#FFFFFF');
          grad.addColorStop(0.4, color.main);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }

        sCtx.fillStyle = grad;
        sCtx.beginPath();
        sCtx.arc(cx, cy, r, 0, Math.PI * 2);
        sCtx.fill();

        dustSprites.push({
          canvas: spriteCanvas,
          radius: r,
          size: s,
          colorType: c
        });
      });
    }
  }

  function hexToRgbA(hex, alpha) {
    let c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
      c= hex.substring(1).split('');
      if(c.length== 3){
        c= [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c= '0x' + c.join('');
      return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
    }
    return hex;
  }

  initDustSprites();

  // ─── Reduced Motion Fallback ──────────────────────────────────────────────
  function runReducedMotionIntro(monoImg, txtImg) {
    loaderEl.style.transition = 'opacity 0.4s ease';
    
    const drawStaticLogo = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const isMobile = canvasWidth < 768;
      const maxMonoWidth = isMobile ? 112 : 280;
      const monoWidth = Math.min(maxMonoWidth, canvasWidth * 0.34);
      const monoHeight = monoWidth * (300 / 465);
      
      const textWidth = monoWidth * 1.5;
      const textHeight = textWidth * (193 / 819);
      const spacing = isMobile ? 10 : 20;
      
      const totalHeight = monoHeight + spacing + textHeight;
      const centerY = canvasHeight / 2;
      const monoCenterY = centerY - totalHeight / 2 + monoHeight / 2;
      const textY = monoCenterY + monoHeight / 2 + spacing;
      
      ctx.drawImage(monoImg, canvasWidth/2 - monoWidth/2, monoCenterY - monoHeight/2, monoWidth, monoHeight);
      ctx.drawImage(txtImg, canvasWidth/2 - textWidth/2, textY, textWidth, textHeight);
    };
    drawStaticLogo();
    window.addEventListener('resize', drawStaticLogo);

    const checkExit = setInterval(() => {
      if (assetsLoaded || forceStartExit) {
        clearInterval(checkExit);
        clearTimeout(loadTimeout);
        
        loaderEl.style.opacity = '0';
        setTimeout(() => {
          window.removeEventListener('resize', drawStaticLogo);
          loaderEl.remove();
          showWatermark();
        }, 400);
      }
    }, 100);
  }

  // ─── Cinematic Particle Intro ─────────────────────────────────────────────
  function runCinematicIntro(monoImg, txtImg) {
    // 1. Offscreen canvas to sample coordinates from monogram silhouette
    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d');
    
    const isMobile = canvasWidth < 768;
    const maxMonoWidth = isMobile ? 112 : 280;
    const monoWidth = Math.min(maxMonoWidth, canvasWidth * 0.34);
    const monoHeight = monoWidth * (300 / 465);
    
    offscreen.width = monoWidth;
    offscreen.height = monoHeight;
    offCtx.drawImage(monoImg, 0, 0, monoWidth, monoHeight);
    
    const imgData = offCtx.getImageData(0, 0, monoWidth, monoHeight);
    const pixels = imgData.data;
    const candidates = [];
    
    // Scan logo and pick non-transparent coordinates
    for (let y = 0; y < monoHeight; y += 1) {
      for (let x = 0; x < monoWidth; x += 1) {
        const idx = (Math.floor(y) * monoWidth + Math.floor(x)) * 4;
        const a = pixels[idx + 3];
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];
        const brightness = (r + g + b) / 3;
        
        if (a > 30 && brightness > 20) {
          candidates.push({
            x: x - monoWidth / 2,
            y: y - monoHeight / 2
          });
        }
      }
    }

    // High quality stardust settings
    const particleCount = isMobile ? 320 : 850;
    const particles = [];
    
    const colors = [
      '#D4AF37', // metallic gold
      '#FFD700', // gold
      '#C9A227', // dark gold
      '#FFFFFF', // pure white
      '#FFF8E7'  // cream
    ];

    const ambientDustCount = Math.floor(particleCount * 0.15); // 15% stay as ambient dust in background
    const orbiterCount = Math.floor(particleCount * 0.10);      // 10% orbit around center in fluid rings

    // Layout configuration for logo and text
    const brandFontSize = Math.max(14, monoWidth * 0.105);
    const taglineFontSize = Math.max(8, monoWidth * 0.044);
    const descFontSize = Math.max(6, monoWidth * 0.026);
    const spacing = isMobile ? 12 : 24;
    const textGap = brandFontSize * 0.70;
    const descGap = taglineFontSize * 0.85;
    const totalHeight = monoHeight + spacing + brandFontSize + taglineFontSize + descFontSize + textGap + descGap;

    let centerX = canvasWidth / 2;
    let centerY = canvasHeight / 2;
    let monoCenterY = centerY - totalHeight / 2 + monoHeight / 2;
    let brandY = monoCenterY + monoHeight / 2 + spacing + brandFontSize * 0.5;
    let taglineY = brandY + brandFontSize * 0.5 + textGap + taglineFontSize * 0.5;
    let descY = taglineY + taglineFontSize * 0.5 + descGap + descFontSize * 0.5;

    // Allocate particles with varying depth, sizes, speeds, and sprite sheets
    for (let i = 0; i < particleCount; i++) {
      const isAmbientDust = i < ambientDustCount;
      const isOrbiter = !isAmbientDust && (i < (ambientDustCount + orbiterCount));
      
      // Depth Layers: back (background), mid (focused logo shape), fore (large bokeh)
      let depth, baseAlpha, layer;
      const rand = Math.random();
      if (rand < 0.30) {
        layer = 'back';
        depth = Math.random() * 0.3 + 0.1; // 0.1 - 0.4
        baseAlpha = Math.random() * 0.18 + 0.12; // dim background specks
      } else if (rand < 0.85) {
        layer = 'mid';
        depth = Math.random() * 0.45 + 0.45; // 0.45 - 0.90
        baseAlpha = Math.random() * 0.40 + 0.45; // bright, sharp focus particles
      } else {
        layer = 'fore';
        depth = Math.random() * 0.6 + 0.90; // 0.90 - 1.50
        baseAlpha = Math.random() * 0.30 + 0.20; // foreground bokeh circles
      }

      // Map to target coordinate relative to monogram center
      const targetIndex = Math.floor(Math.random() * candidates.length);
      const target = candidates[targetIndex] || { x: 0, y: 0 };
      
      // Spawn particles randomly on canvas
      const px = Math.random() * canvasWidth;
      const py = Math.random() * canvasHeight;

      // Spiral swirl trajectory properties
      const swirlTurns = Math.random() * 0.25 + 0.15;
      const direction = Math.random() < 0.5 ? 1 : -1;
      const speedMult = depth;

      // Map color and choose corresponding pre-rendered dust sprite
      const color = colors[Math.floor(Math.random() * colors.length)];
      const isWhite = color === '#FFFFFF' || color === '#FFF8E7';
      const colorType = isWhite ? 1 : 0; // 0 for Gold, 1 for White/Cream

      let sizeIdx = 1; // default 4px size
      if (layer === 'back') {
        sizeIdx = Math.random() < 0.6 ? 0 : 1; // 2px or 4px
      } else if (layer === 'mid') {
        sizeIdx = Math.random() < 0.5 ? 1 : 2; // 4px or 8px
      } else {
        sizeIdx = Math.random() < 0.6 ? 3 : 4; // 16px or 32px
      }
      const spriteIdx = colorType * 5 + sizeIdx;

      particles.push({
        x: px,
        y: py,
        startX: px,
        startY: py,
        targetOffsetX: target.x,
        targetOffsetY: target.y,
        vx: (Math.random() - 0.5) * 0.3 * speedMult,
        vy: (Math.random() - 0.5) * 0.3 * speedMult,
        depth: depth,
        layer: layer,
        baseAlpha: baseAlpha,
        alpha: baseAlpha,
        color: color,
        spriteIdx: spriteIdx,
        phase: 'ambient', // 'ambient', 'converge', 'resolved', 'orbit', 'exit'
        swirlTurns: swirlTurns,
        direction: direction,
        
        isAmbientDust: isAmbientDust,
        isOrbiter: isOrbiter,
        
        // Fluid orbiting properties
        orbitSpeed: (Math.random() * 0.004 + 0.0015) * (Math.random() < 0.5 ? 1 : -1),
        orbitRadius: Math.hypot(target.y, target.x) + (Math.random() * 45 + 10),
        orbitAngle: Math.atan2(target.y, target.x),
        orbitPhase: Math.random() * Math.PI * 2,
        
        // Extended history array for smooth motion trails
        history: [],
        
        // Organic wave motion properties
        waveOffset: Math.random() * Math.PI * 2,
        waveSpeed: Math.random() * 0.01 + 0.005
      });
    }

    let startTime = null;
    let exitStartTime = null;
    let isExiting = false;

    // Timeline control constants (Handcrafted Cinematic Timing)
    const TIME_CONVERGE = 500;      // Start convergence at 500ms
    const TIME_REVEAL_MONO = 1200;  // Start monogram image fade-in and light-sculpt at 1.2s
    const TIME_REVEAL_TEXT1 = 1800; // Line 1 ("VELNORYX") reveal starts at 1.8s
    const TIME_REVEAL_TEXT2 = 2500; // Line 2 ("STUDIO") reveal starts at 2.5s (700ms pause)
    const TIME_REVEAL_TEXT3 = 3100; // Line 3 ("CRAFTING...") reveal starts at 3.1s
    const TIME_SHIMMER = 3700;      // Soft light sweep starts at 3.7s
    const TIME_EXIT_TRIGGER = 5200; // Exit transition starts at 5.2s (fully revealed state visible for 1.1s)

    function updateParticle(p, elapsed, timestamp) {
      // Record history for motion trails (longer trails for cinematic speed)
      p.history.push({ x: p.x, y: p.y });
      if (p.history.length > 8) {
        p.history.shift();
      }

      // Exit phase animation
      if (p.phase === 'exit' && exitStartTime !== null) {
        const exitProgress = Math.min((timestamp - exitStartTime) / 1000, 1.0);
        
        // Flow field dissolve with outward radial expansion
        const noiseAngle = PerlinNoise.noise2D(p.x * 0.01, p.y * 0.01 + timestamp * 0.001) * Math.PI * 2;
        p.x += p.vx + Math.cos(noiseAngle) * 0.6;
        p.y += p.vy + Math.sin(noiseAngle) * 0.6;
        
        p.alpha = p.baseAlpha * (1 - exitProgress);
        return;
      }

      // Ambient background dust floating
      if (p.isAmbientDust) {
        const noiseScale = 0.002;
        const flowAngle = PerlinNoise.noise2D(p.x * noiseScale, p.y * noiseScale + timestamp * 0.0003) * Math.PI * 4;
        const speed = p.depth * 0.3;
        
        p.x += Math.cos(flowAngle) * speed;
        p.y += Math.sin(flowAngle) * speed;

        if (p.x < -20) p.x = canvasWidth + 20;
        if (p.x > canvasWidth + 20) p.x = -20;
        if (p.y < -20) p.y = canvasHeight + 20;
        if (p.y > canvasHeight + 20) p.y = -20;
        return;
      }

      // Initial free floating state
      if (p.phase === 'ambient') {
        const noiseScale = 0.0015;
        const flowAngle = PerlinNoise.noise2D(p.x * noiseScale, p.y * noiseScale + timestamp * 0.0004) * Math.PI * 4;
        const speed = p.depth * 0.45;

        p.x += Math.cos(flowAngle) * speed;
        p.y += Math.sin(flowAngle) * speed;
        
        if (p.x < -20) p.x = canvasWidth + 20;
        if (p.x > canvasWidth + 20) p.x = -20;
        if (p.y < -20) p.y = canvasHeight + 20;
        if (p.y > canvasHeight + 20) p.y = -20;

        if (elapsed >= TIME_CONVERGE) {
          p.phase = 'converge';
          p.startX = p.x;
          p.startY = p.y;
        }
      } 
      // Curved spiral convergence using Bezier/Perlin noise field
      else if (p.phase === 'converge') {
        const depthDelay = (1.5 - p.depth) * 200;
        const progress = Math.min(Math.max((elapsed - TIME_CONVERGE - depthDelay) / 1400, 0), 1);
        const tEased = easeInOutCubic(progress);

        const targetX = centerX + p.targetOffsetX;
        const targetY = monoCenterY + p.targetOffsetY;

        // Spiral mathematics around logo center
        const startDist = Math.hypot(p.startY - monoCenterY, p.startX - centerX) || 0.1;
        const startAngle = Math.atan2(p.startY - monoCenterY, p.startX - centerX);
        const targetDist = Math.hypot(targetY - monoCenterY, targetX - centerX);
        const targetAngle = Math.atan2(targetY - monoCenterY, targetX - centerX);

        const totalTurns = p.swirlTurns * Math.PI * 2 * p.direction;
        
        // Swirl angular interpolation
        const currentAngle = startAngle + (targetAngle - startAngle) * tEased + (1 - tEased) * totalTurns;
        const currentDist = startDist + (targetDist - startDist) * tEased;

        const bx = centerX + currentDist * Math.cos(currentAngle);
        const by = monoCenterY + currentDist * Math.sin(currentAngle);

        // Add fading flow field noise turbulence to curved trajectory
        const turbulenceIntensity = 65 * (1 - tEased) * tEased * p.depth;
        const noiseScale = 0.008;
        const noiseAngle = PerlinNoise.noise2D(p.x * noiseScale, p.y * noiseScale + timestamp * 0.001) * Math.PI * 2;

        p.x = bx + Math.cos(noiseAngle) * turbulenceIntensity;
        p.y = by + Math.sin(noiseAngle) * turbulenceIntensity;

        if (progress >= 1) {
          p.phase = p.isOrbiter ? 'orbit' : 'resolved';
        }
      }
      // Breathing, settled particle on the logo
      else if (p.phase === 'resolved') {
        const targetX = centerX + p.targetOffsetX;
        const targetY = monoCenterY + p.targetOffsetY;
        
        // Gentle micro-breathing so the resolved shape feels alive
        p.x = targetX + Math.sin(timestamp * 0.001 + targetY) * 0.12;
        p.y = targetY + Math.cos(timestamp * 0.001 + targetX) * 0.12;
      }
      // Floating outer orbit ring around completed logo
      else if (p.phase === 'orbit') {
        p.orbitAngle += p.orbitSpeed * 0.4;
        
        const noiseVal = PerlinNoise.noise2D(p.orbitRadius * 0.015, timestamp * 0.0006 + p.orbitPhase) * 6;
        const currentRadius = p.orbitRadius + Math.sin(timestamp * 0.0004 + p.orbitPhase) * 3 + noiseVal;
        
        p.x = centerX + currentRadius * Math.cos(p.orbitAngle);
        p.y = monoCenterY + currentRadius * Math.sin(p.orbitAngle);
      }
    }

    function drawParticle(p, logoOpacity, exitProgress, timestamp) {
      if (p.alpha <= 0) return;

      const focusDistance = 0.70;
      const focusDiff = Math.abs(p.depth - focusDistance);
      
      let size = 1.0 * p.depth;
      
      // Determine physical drawing scale based on depth
      if (p.layer === 'fore') {
        size = 2.4 * p.depth * (1.0 + focusDiff * 2.2); // bokeh disks
      } else if (p.layer === 'back') {
        size = 0.75 * p.depth; // small distant points
      } else {
        size = 1.2 * p.depth * (1.0 + focusDiff * 0.4); // core focus particles
      }
      
      let finalAlpha = p.alpha;
      if (p.phase === 'resolved') {
        finalAlpha = p.baseAlpha * (1.0 - logoOpacity * 0.85); // particles dissolve into metallic image
      } else if (p.phase === 'orbit') {
        finalAlpha = (p.baseAlpha * 1.15) + Math.sin(timestamp * 0.0015 + p.orbitPhase) * 0.12;
        finalAlpha = Math.max(0.12, Math.min(finalAlpha, 0.80));
      } else if (p.isAmbientDust) {
        finalAlpha = p.baseAlpha + Math.sin(timestamp * 0.001 + p.waveOffset) * 0.08;
        finalAlpha = Math.max(0.08, Math.min(finalAlpha, 0.40));
      } else {
        finalAlpha = p.alpha / (1.0 + focusDiff * 1.5);
      }

      if (isExiting) {
        finalAlpha = finalAlpha * (1.0 - exitProgress);
      }

      if (finalAlpha <= 0.008) return;

      // Draw stardust motion trails using screen blending
      if (p.history.length > 1 && (p.phase === 'converge' || p.phase === 'exit')) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        for (let j = 0; j < p.history.length - 1; j++) {
          const pt1 = p.history[j];
          const pt2 = p.history[j+1];
          const trailProgress = j / (p.history.length - 1);
          
          ctx.beginPath();
          ctx.moveTo(pt1.x, pt1.y);
          ctx.lineTo(pt2.x, pt2.y);
          
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = finalAlpha * 0.25 * Math.pow(trailProgress, 1.6);
          ctx.lineWidth = size * 0.75 * trailProgress;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
        ctx.restore();
      }

      // Draw pre-rendered volumetric stardust sprites (high performance)
      const sprite = dustSprites[p.spriteIdx];
      if (sprite) {
        ctx.save();
        ctx.globalAlpha = finalAlpha;
        ctx.drawImage(
          sprite.canvas,
          p.x - size, p.y - size,
          size * 2, size * 2
        );
        ctx.restore();
      }
    }

    // Overlapping volumetric blooms around completed logo
    function drawLogoGlow(elapsed, exitProgress, timestamp) {
      const glowProgress = Math.min(Math.max((elapsed - TIME_CONVERGE) / 1500, 0), 1);
      if (glowProgress <= 0) return;

      ctx.save();
      
      const finalGlowOpacity = isExiting ? glowProgress * (1 - exitProgress) : glowProgress;
      const breathe = 1.0 + Math.sin(timestamp * 0.0006) * 0.02;

      ctx.globalCompositeOperation = 'screen';

      // 1. Wide Ambient Bloom (Very faint, gold-bronze)
      const r1 = monoWidth * 2.4 * breathe;
      const radialGrad1 = ctx.createRadialGradient(
        centerX, monoCenterY, 0,
        centerX, monoCenterY, r1
      );
      radialGrad1.addColorStop(0, `rgba(212, 163, 71, ${0.07 * finalGlowOpacity})`);
      radialGrad1.addColorStop(0.4, `rgba(212, 163, 71, ${0.025 * finalGlowOpacity})`);
      radialGrad1.addColorStop(0.7, `rgba(212, 163, 71, ${0.007 * finalGlowOpacity})`);
      radialGrad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = radialGrad1;
      ctx.fillRect(centerX - r1, monoCenterY - r1, r1 * 2, r1 * 2);

      // 2. Volumetric Glow (Warm gold, medium radius)
      const r2 = monoWidth * 1.2 * breathe;
      const radialGrad2 = ctx.createRadialGradient(
        centerX, monoCenterY, 0,
        centerX, monoCenterY, r2
      );
      radialGrad2.addColorStop(0, `rgba(226, 192, 116, ${0.13 * finalGlowOpacity})`);
      radialGrad2.addColorStop(0.5, `rgba(212, 163, 71, ${0.045 * finalGlowOpacity})`);
      radialGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = radialGrad2;
      ctx.fillRect(centerX - r2, monoCenterY - r2, r2 * 2, r2 * 2);

      // 3. Core Bloom (Bright cream/white-gold, tight radius)
      if (elapsed >= TIME_REVEAL_MONO) {
        const coreProgress = Math.min((elapsed - TIME_REVEAL_MONO) / 1200, 1.0);
        const coreOpacity = coreProgress * 0.20 * (isExiting ? 1 - exitProgress : 1);
        const r3 = monoWidth * 0.55 * breathe;
        
        const radialGrad3 = ctx.createRadialGradient(
          centerX, monoCenterY, 0,
          centerX, monoCenterY, r3
        );
        radialGrad3.addColorStop(0, `rgba(255, 245, 220, ${coreOpacity})`);
        radialGrad3.addColorStop(0.4, `rgba(226, 192, 116, ${coreOpacity * 0.45})`);
        radialGrad3.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = radialGrad3;
        ctx.fillRect(centerX - r3, monoCenterY - r3, r3 * 2, r3 * 2);
      }

      ctx.restore();
    }

    function drawLogoMonogram(elapsed, logoOpacity, exitProgress, timestamp) {
      if (logoOpacity <= 0) return;

      const monoX = centerX - monoWidth / 2;
      const monoY = monoCenterY - monoHeight / 2;
      
      let finalLogoOpacity = logoOpacity;
      if (isExiting) {
        finalLogoOpacity = logoOpacity * (1 - exitProgress);
      }

      // Layer A: Additive "Sculpted from Light" overlay
      // Peaks at logoOpacity = 0.5, then dissolves as the solid metallic monogram is built
      const lightOpacity = Math.sin(logoOpacity * Math.PI) * 0.55 * (isExiting ? 1 - exitProgress : 1);
      if (lightOpacity > 0.01) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = lightOpacity;
        ctx.shadowBlur = 24 * (1.2 - logoOpacity);
        ctx.shadowColor = '#FFF5DC';
        ctx.drawImage(monoImg, monoX, monoY, monoWidth, monoHeight);
        ctx.restore();
      }

      // Layer B: Main metallic monogram logo
      ctx.save();
      ctx.globalAlpha = finalLogoOpacity;
      
      // Subtle premium shadow/reflection glow
      if (!isExiting) {
        ctx.shadowBlur = 10 + Math.sin(timestamp * 0.0015) * 3;
        ctx.shadowColor = 'rgba(226, 192, 116, 0.25)';
      }
      
      ctx.drawImage(monoImg, monoX, monoY, monoWidth, monoHeight);
      
      // Layer C: Premium Diagonal Metallic Light Sweep (Shimmer)
      if (elapsed >= TIME_SHIMMER) {
        ctx.globalCompositeOperation = 'source-atop';
        
        const shimmerDuration = 1800; // Slower, luxury sweep duration
        const shimmerInterval = 4800; // Premium pause spacing
        const shimmerProgress = ((elapsed - TIME_SHIMMER) % shimmerInterval) / shimmerDuration;
        
        if (shimmerProgress <= 1.0) {
          const sweepRange = monoWidth * 2.3;
          const currentOffset = -monoWidth * 0.65 + shimmerProgress * sweepRange;
          
          // 45 degree diagonal gradient line
          const x0 = monoX + currentOffset;
          const y0 = monoY;
          const x1 = x0 + monoWidth * 0.5;
          const y1 = monoY + monoHeight;
          
          const grad = ctx.createLinearGradient(x0, y0, x1, y1);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          grad.addColorStop(0.35, 'rgba(255, 240, 200, 0.0)');
          grad.addColorStop(0.5, 'rgba(255, 248, 220, 0.22)'); // Soft feathered sheen
          grad.addColorStop(0.65, 'rgba(255, 240, 200, 0.0)');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = grad;
          ctx.fillRect(monoX, monoY, monoWidth, monoHeight);
        }
      }
      
      ctx.restore();
    }

    // Helper to draw text character-by-character with spacing and alignment
    function drawTextWithSpacing(text, x, y, font, fontSize, spacing, fillStyle, opacity) {
      ctx.save();
      ctx.font = font;
      ctx.globalAlpha = opacity;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      const chars = text.split('');
      const charWidths = chars.map(c => ctx.measureText(c).width);
      const totalWidth = charWidths.reduce((a, b) => a + b, 0) + (chars.length - 1) * spacing;

      let currentX = x - totalWidth / 2;
      for (let i = 0; i < chars.length; i++) {
        if (typeof fillStyle === 'function') {
          ctx.fillStyle = fillStyle(chars[i], i);
        } else {
          ctx.fillStyle = fillStyle;
        }
        ctx.fillText(chars[i], currentX + charWidths[i] / 2, y);
        currentX += charWidths[i] + spacing;
      }
      ctx.restore();
    }

    function drawLogoText(elapsed, exitProgress, timestamp) {
      // Line 1: VELNORYX (Outfit Sans-serif, Gold for VELNORY, Silver/White for X)
      const t1 = Math.min(Math.max((elapsed - TIME_REVEAL_TEXT1) / 1200, 0), 1);
      const e1 = easeOutQuart(t1);
      
      // Line 2: STUDIO (Outfit Sans-serif, Gold dashes, Silver/White STUDIO)
      const t2 = Math.min(Math.max((elapsed - TIME_REVEAL_TEXT2) / 1200, 0), 1);
      const e2 = easeOutQuart(t2);

      // Line 3: Tagline Description (Outfit Sans-serif, Lighter Silver/White)
      const t3 = Math.min(Math.max((elapsed - TIME_REVEAL_TEXT3) / 1200, 0), 1);
      const e3 = easeOutQuart(t3);

      let exitOffset = 0;
      if (isExiting) {
        exitOffset = exitProgress * 15; // Slide down slightly on exit
      }

      // Line 1 Reveal
      if (t1 > 0) {
        let opacity1 = e1;
        if (isExiting) {
          opacity1 = opacity1 * (1 - exitProgress);
        }

        const currentY1 = brandY + (1 - e1) * 15 + exitOffset; // Smooth float upward
        
        // Tighten letter spacing dynamically as it settles
        const startSpacing1 = brandFontSize * 0.95;
        const endSpacing1 = brandFontSize * 0.58;
        const currentSpacing1 = startSpacing1 - (startSpacing1 - endSpacing1) * e1;

        // Fonts styles & gradients
        const fontStyle = `300 ${brandFontSize}px 'Outfit'`;
        
        const gradGold1 = ctx.createLinearGradient(0, currentY1 - brandFontSize * 0.5, 0, currentY1 + brandFontSize * 0.5);
        gradGold1.addColorStop(0, '#FFFFFF');     // white highlights
        gradGold1.addColorStop(0.2, '#FFF8E7');   // cream sheen
        gradGold1.addColorStop(0.45, '#D4AF37');  // gold body
        gradGold1.addColorStop(1, '#A0760F');     // dark shadow

        const gradSilver1 = ctx.createLinearGradient(0, currentY1 - brandFontSize * 0.5, 0, currentY1 + brandFontSize * 0.5);
        gradSilver1.addColorStop(0, '#FFFFFF');     // white highlights
        gradSilver1.addColorStop(0.45, '#FFF8E7');   // cream sheen
        gradSilver1.addColorStop(1, '#B0B5BC');     // silver shadow

        const fillStyle1 = (char, idx) => {
          return idx === 7 ? gradSilver1 : gradGold1; // 'X' is index 7
        };

        // Sculpted from light glow
        if (t1 < 1.0 && !isExiting) {
          ctx.save();
          ctx.shadowBlur = 18 * (1 - e1);
          ctx.shadowColor = 'rgba(255, 245, 220, 0.45)';
          drawTextWithSpacing('VELNORYX', centerX, currentY1, fontStyle, brandFontSize, currentSpacing1, fillStyle1, opacity1);
          ctx.restore();
        } else {
          drawTextWithSpacing('VELNORYX', centerX, currentY1, fontStyle, brandFontSize, currentSpacing1, fillStyle1, opacity1);
        }
      }

      // Line 2 Reveal
      if (t2 > 0) {
        let opacity2 = e2;
        if (isExiting) {
          opacity2 = opacity2 * (1 - exitProgress);
        }

        const currentY2 = taglineY + (1 - e2) * 15 + exitOffset; // Smooth float upward
        
        // Tighten letter spacing dynamically as it settles
        const startSpacing2 = taglineFontSize * 2.2;
        const endSpacing2 = taglineFontSize * 1.35;
        const currentSpacing2 = startSpacing2 - (startSpacing2 - endSpacing2) * e2;

        const fontStyle = `300 ${taglineFontSize}px 'Outfit'`;
        
        const gradGold2 = ctx.createLinearGradient(0, currentY2 - taglineFontSize * 0.5, 0, currentY2 + taglineFontSize * 0.5);
        gradGold2.addColorStop(0, '#FFFFFF');     // white highlights
        gradGold2.addColorStop(0.2, '#FFF8E7');   // cream sheen
        gradGold2.addColorStop(0.45, '#D4AF37');  // gold body
        gradGold2.addColorStop(1, '#A0760F');     // dark shadow

        const gradSilver2 = ctx.createLinearGradient(0, currentY2 - taglineFontSize * 0.5, 0, currentY2 + taglineFontSize * 0.5);
        gradSilver2.addColorStop(0, '#FFFFFF');     // white highlights
        gradSilver2.addColorStop(0.45, '#FFF8E7');   // cream sheen
        gradSilver2.addColorStop(1, '#B0B5BC');     // silver shadow

        const fillStyle2 = (char, idx) => {
          return (idx === 0 || idx === 9) ? gradGold2 : gradSilver2; // dashes are index 0 & 9
        };

        // Sculpted from light glow
        if (t2 < 1.0 && !isExiting) {
          ctx.save();
          ctx.shadowBlur = 12 * (1 - e2);
          ctx.shadowColor = 'rgba(255, 245, 220, 0.4)';
          drawTextWithSpacing('— STUDIO —', centerX, currentY2, fontStyle, taglineFontSize, currentSpacing2, fillStyle2, opacity2);
          ctx.restore();
        } else {
          drawTextWithSpacing('— STUDIO —', centerX, currentY2, fontStyle, taglineFontSize, currentSpacing2, fillStyle2, opacity2);
        }
      }

      // Line 3 Reveal
      if (t3 > 0) {
        let opacity3 = e3;
        if (isExiting) {
          opacity3 = opacity3 * (1 - exitProgress);
        }

        const currentY3 = descY + (1 - e3) * 15 + exitOffset; // Smooth float upward
        
        // Tighten letter spacing dynamically as it settles
        const startSpacing3 = descFontSize * 1.2;
        const endSpacing3 = descFontSize * 0.45;
        const currentSpacing3 = startSpacing3 - (startSpacing3 - endSpacing3) * e3;

        const fontStyle = `300 ${descFontSize}px 'Outfit'`;
        
        const gradSilver3 = ctx.createLinearGradient(0, currentY3 - descFontSize * 0.5, 0, currentY3 + descFontSize * 0.5);
        gradSilver3.addColorStop(0, '#FFFFFF');     // bright white highlight
        gradSilver3.addColorStop(0.45, '#FFF5DC');   // warm cream sheen
        gradSilver3.addColorStop(1, '#B0B5BC');     // silver shadow

        // Sculpted from light glow
        if (t3 < 1.0 && !isExiting) {
          ctx.save();
          ctx.shadowBlur = 10 * (1 - e3);
          ctx.shadowColor = 'rgba(255, 245, 220, 0.35)';
          drawTextWithSpacing('CRAFTING EXCEPTIONAL DIGITAL EXPERIENCES', centerX, currentY3, fontStyle, descFontSize, currentSpacing3, gradSilver3, opacity3);
          ctx.restore();
        } else {
          drawTextWithSpacing('CRAFTING EXCEPTIONAL DIGITAL EXPERIENCES', centerX, currentY3, fontStyle, descFontSize, currentSpacing3, gradSilver3, opacity3);
        }
      }
    }

    function drawVignette(elapsed, exitProgress) {
      ctx.save();
      const vignetteOpacity = isExiting ? (1 - exitProgress) * 0.72 : 0.72;
      const vignetteGrad = ctx.createRadialGradient(
        centerX, centerY, Math.min(canvasWidth, canvasHeight) * 0.32,
        centerX, centerY, Math.max(canvasWidth, canvasHeight) * 0.95
      );
      vignetteGrad.addColorStop(0, 'rgba(3, 7, 18, 0)');
      vignetteGrad.addColorStop(0.55, `rgba(3, 7, 18, ${vignetteOpacity * 0.35})`);
      vignetteGrad.addColorStop(1, `rgba(3, 7, 18, ${vignetteOpacity * 0.92})`);
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.restore();
    }

    // Dynamic resize coordinate synchronization
    const updateLayout = () => {
      centerX = canvasWidth / 2;
      centerY = canvasHeight / 2;
      monoCenterY = centerY - totalHeight / 2 + monoHeight / 2;
      brandY = monoCenterY + monoHeight / 2 + spacing + brandFontSize * 0.5;
      taglineY = brandY + brandFontSize * 0.5 + textGap + taglineFontSize * 0.5;
      descY = taglineY + taglineFontSize * 0.5 + descGap + descFontSize * 0.5;
    };
    window.addEventListener('resize', updateLayout);
    updateLayout();

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Handle Exit Wipe Triggering
      if (elapsed >= TIME_EXIT_TRIGGER && !isExiting) {
        if (assetsLoaded || forceStartExit) {
          isExiting = true;
          exitStartTime = timestamp;
          loaderEl.classList.add('exit-active');
          clearTimeout(loadTimeout);
          
          // Notify React application to trigger homepage fade-ins
          document.dispatchEvent(new CustomEvent('loaderFinished'));
          
          // Disperse particles outward on exit
          particles.forEach(p => {
            p.phase = 'exit';
            const dx = p.x - centerX;
            const dy = p.y - monoCenterY;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            
            // Outward blast speed scaled by depth
            const speed = (Math.random() * 2.0 + 1.2) * p.depth;
            p.vx = (dx / dist) * speed + (Math.random() - 0.5) * 0.4;
            p.vy = (dy / dist) * speed + (Math.random() - 0.5) * 0.4;
          });

          // Delete Loader DOM node and show watermark
          setTimeout(() => {
            window.removeEventListener('resize', updateLayout);
            loaderEl.remove();
            showWatermark();
          }, 1200); // Clean up after 1.2s exit fadeout
        }
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // calculate exit progress
      let exitProgress = 0;
      if (isExiting && exitStartTime !== null) {
        exitProgress = Math.min((timestamp - exitStartTime) / 1200, 1.0);
      }

      // Update particle coordinates
      particles.forEach(p => {
        updateParticle(p, elapsed, timestamp);
      });

      // Render Background Particles & Ambient Dust (outside breathing camera/logo)
      // Layer 1: Background particles (depth < 0.45)
      particles.filter(p => p.depth < 0.45).forEach(p => {
        drawParticle(p, 0, exitProgress, timestamp);
      });

      // Camera / Logo Breathing Motion (Parallax depth - only core logo elements breathe)
      ctx.save();
      
      const breatheScale = 1.0 + Math.sin(timestamp * 0.0006) * 0.003;
      const breatheY = Math.sin(timestamp * 0.0008) * 1.5;
      
      ctx.translate(centerX, centerY);
      ctx.scale(breatheScale, breatheScale);
      ctx.translate(-centerX, -centerY + breatheY);

      // Logo Image reveal opacity calculation
      let logoOpacity = 0;
      if (elapsed >= TIME_REVEAL_MONO) {
        const revealProgress = Math.min((elapsed - TIME_REVEAL_MONO) / 1500, 1.0);
        logoOpacity = easeInOutCubic(revealProgress);
      }

      // Layer 2: Glowing volumetric background
      drawLogoGlow(elapsed, exitProgress, timestamp);

      // Layer 3: Midground Particles (0.45 <= depth < 0.90)
      particles.filter(p => p.depth >= 0.45 && p.depth < 0.90).forEach(p => {
        drawParticle(p, logoOpacity, exitProgress, timestamp);
      });

      // Layer 4: Monogram image
      drawLogoMonogram(elapsed, logoOpacity, exitProgress, timestamp);

      // Layer 5: Dynamic Text Lines
      drawLogoText(elapsed, exitProgress, timestamp);

      // Layer 6: Foreground Bokeh Particles (depth >= 0.90)
      particles.filter(p => p.depth >= 0.90).forEach(p => {
        drawParticle(p, logoOpacity, exitProgress, timestamp);
      });

      ctx.restore(); // Restore camera breathing

      // Layer 7: Vignette (static on screen)
      drawVignette(elapsed, exitProgress);

      if (!isExiting || (timestamp - exitStartTime) < 1400) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  // ─── Dynamic Watermark Rendering ──────────────────────────────────────────
  function showWatermark() {
    if (document.getElementById('velnoryx-watermark')) return;

    const wmImg = new Image();
    wmImg.src = '/logo_monogram_trimmed.png';
    wmImg.crossOrigin = 'anonymous';
    wmImg.onload = () => {
      const filteredDataUrl = filterLogoToGold(wmImg);
      
      const container = document.createElement('div');
      container.id = 'velnoryx-watermark';
      
      const img = document.createElement('img');
      img.src = filteredDataUrl;
      img.alt = 'Velnoryx Studio Monogram';
      img.className = 'wm-logo';
      
      const text = document.createElement('div');
      text.className = 'wm-text';
      text.textContent = 'designed and developed by velnoryx studios';
      
      container.appendChild(img);
      container.appendChild(text);
      document.body.appendChild(container);
    };
  }

  function filterLogoToGold(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    
    const targetR = 226;
    const targetG = 192;
    const targetB = 116;
    
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i+3];
      if (a > 10) {
        data[i] = targetR;
        data[i+1] = targetG;
        data[i+2] = targetB;
      }
    }
    
    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL();
  }
})();
