/**
 * Firework - Interactive fireworks animation library
 */
export default class Firework {
  static PALETTES = {
    rainbow: [[255,0,0], [255,127,0], [255,255,0], [0,255,0], [0,0,255], [75,0,130], [148,0,211]],
    fire: [[255,69,0], [255,140,0], [255,215,0], [255,255,0]],
    ocean: [[0,119,190], [0,180,216], [144,224,239]],
    monochrome: [[255,255,255]]
  };

  constructor(options = {}) {
    // Initialize particles array
    this.particles = [];

    // Initialize animation ID
    this.animationId = null;

    // Set default configuration
    this.defaults = {
      particleCount: 50,
      gravity: 0.1,
      fadeSpeed: 0.02
    };

    // Merge user options with defaults
    this.options = { ...this.defaults, ...options };

    // Parse and store color options
    this.colorPalette = this._parseColors(options.colors || 'rainbow');
    this.colorMode = options.colorMode || 'multi';

    // Store event callbacks
    this.onLaunch = options.onLaunch || null;
    this.onComplete = options.onComplete || null;

    // Initialize completion flag
    this._completeFired = false;

    // Accessibility: Handle motion preferences
    this.reducedMotion = options.reducedMotion !== undefined
      ? options.reducedMotion
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.disableAnimations = options.disableAnimations || false;

    // Get or create canvas
    if (options.canvas) {
      this.canvas = options.canvas;
      this.autoCreated = false;
    } else {
      this.canvas = this._createCanvas();
      this.autoCreated = true;
    }

    // Get canvas 2D context
    this.ctx = this.canvas.getContext('2d');
  }

  _parseColors(colors) {
    try {
      // If colors is a string
      if (typeof colors === 'string') {
        // Check if it's a hex color (starts with #)
        if (colors.startsWith('#')) {
          // Parse hex to RGB
          const r = parseInt(colors.slice(1, 3), 16);
          const g = parseInt(colors.slice(3, 5), 16);
          const b = parseInt(colors.slice(5, 7), 16);

          // Validate RGB values
          if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
            return [[r, g, b]];
          }
        }

        // Check if it's a palette name
        if (Firework.PALETTES[colors]) {
          return Firework.PALETTES[colors];
        }

        // Otherwise return default rainbow palette
        return Firework.PALETTES.rainbow;
      }

      // If colors is an array
      if (Array.isArray(colors)) {
        // If first element is a number (RGB array)
        if (typeof colors[0] === 'number') {
          // Validate RGB values are in 0-255 range
          if (colors.length === 3 &&
              colors[0] >= 0 && colors[0] <= 255 &&
              colors[1] >= 0 && colors[1] <= 255 &&
              colors[2] >= 0 && colors[2] <= 255) {
            return [colors];
          }
        }

        // If array of arrays
        if (Array.isArray(colors[0])) {
          // Validate each RGB array
          const validColors = colors.filter(rgb =>
            Array.isArray(rgb) &&
            rgb.length === 3 &&
            rgb[0] >= 0 && rgb[0] <= 255 &&
            rgb[1] >= 0 && rgb[1] <= 255 &&
            rgb[2] >= 0 && rgb[2] <= 255
          );

          // Return validated colors or fallback to rainbow
          if (validColors.length > 0) {
            return validColors;
          }
        }
      }

      // Fallback to rainbow palette
      return Firework.PALETTES.rainbow;
    } catch (error) {
      // On any error, return rainbow palette
      return Firework.PALETTES.rainbow;
    }
  }

  _rgbToString(rgb) {
    // Convert [r,g,b] array to "rgb(r,g,b)" string
    return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  }

  _createCanvas() {
    // Create canvas element
    const canvas = document.createElement('canvas');

    // Style as fullscreen overlay
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Accessibility: Add ARIA attributes to hide decorative canvas from screen readers
    canvas.setAttribute('aria-hidden', 'true');
    canvas.setAttribute('role', 'presentation');

    // Append to document body
    document.body.appendChild(canvas);

    // Return canvas element
    return canvas;
  }

  _createParticles(x, y, config = {}) {
    // Get particle count from config or use default
    const particleCount = config.particleCount || this.defaults.particleCount;

    // Get color palette from config or use default
    const palette = config.colorPalette || this.colorPalette;

    // Get color mode from config or use default
    const mode = config.colorMode || this.colorMode;

    // Create array of particle objects
    const particles = [];

    // For each particle
    for (let i = 0; i < particleCount; i++) {
      // Random angle: Math.random() * Math.PI * 2
      const angle = Math.random() * Math.PI * 2;

      // Random speed: 5 + Math.random() * 5 (5-10 pixels/frame)
      const speed = 5 + Math.random() * 5;

      // Calculate velocity
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      // Determine particle color based on mode
      let rgb;
      if (mode === 'single') {
        rgb = palette[0];
      } else {
        // mode === 'multi'
        rgb = palette[Math.floor(Math.random() * palette.length)];
      }

      // Convert RGB array to color string
      const colorStr = this._rgbToString(rgb);

      // Create particle object
      particles.push({
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        color: colorStr,
        alpha: 1.0,
        life: 1.0
      });
    }

    // Return array of particles
    return particles;
  }

  _updateParticles() {
    // Loop through all particles
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];

      // Apply gravity
      particle.vy += this.defaults.gravity;

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Apply alpha decay
      particle.alpha -= this.defaults.fadeSpeed;

      // Decrease life
      particle.life -= 0.01;
    }

    // Filter out dead particles
    this.particles = this.particles.filter(p => p.alpha > 0);
  }

  _animate() {
    // Update particles
    this._updateParticles();

    // Render particles
    this._render();

    // Continue loop if particles exist
    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(this._animate.bind(this));
    } else {
      // Otherwise stop
      this.animationId = null;

      // Fire onComplete callback once
      if (this.onComplete && !this._completeFired) {
        this._completeFired = true;
        this.onComplete();
      }
    }
  }

  launch(x, y, overrides = {}) {
    // Handle disabled animations
    if (this.disableAnimations) return;

    // Handle reduced motion preference
    if (this.reducedMotion) {
      this._showStaticCelebration(x, y);
      if (this.onLaunch) this.onLaunch(x, y);
      return;
    }

    // Parse colors if provided in overrides
    const colors = overrides.colors ? this._parseColors(overrides.colors) : this.colorPalette;

    // Merge overrides with defaults for config
    const config = { ...this.defaults, ...overrides, colorPalette: colors };

    // Fire onLaunch callback
    if (this.onLaunch) {
      this.onLaunch(x, y);
    }

    // Reset completion flag for new launch
    this._completeFired = false;

    // Create new particles
    const newParticles = this._createParticles(x, y, config);

    // Add to particles array
    this.particles.push(...newParticles);

    // Start animation if not running
    if (!this.animationId) {
      this._animate();
    }
  }

  _showStaticCelebration(x, y) {
    // Draw a simple static starburst for reduced motion users
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Save canvas state
    ctx.save();

    // Create radial gradient for visual effect
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 50);
    const rgb = this.colorPalette[0];
    gradient.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.8)`);
    gradient.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);

    // Draw circle
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 50, 0, Math.PI * 2);
    ctx.fill();

    // Restore canvas state
    ctx.restore();

    // Fade out after 300ms
    setTimeout(() => {
      ctx.clearRect(0, 0, width, height);
      // Fire onComplete callback
      if (this.onComplete && !this._completeFired) {
        this._completeFired = true;
        this.onComplete();
      }
    }, 300);
  }

  _render() {
    // Get canvas dimensions
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);

    // Save canvas state
    this.ctx.save();

    // Loop through all particles in particles array
    for (const particle of this.particles) {
      // Begin path
      this.ctx.beginPath();

      // Set fill style with color
      this.ctx.fillStyle = particle.color;

      // Set global alpha
      this.ctx.globalAlpha = particle.alpha;

      // Draw circle at particle position (radius 3px)
      this.ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);

      // Fill the circle
      this.ctx.fill();
    }

    // Restore canvas state
    this.ctx.restore();
  }

  stop() {
    // Cancel animation frame if running
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    // Clear particles array
    this.particles = [];

    // Remove canvas from DOM if auto-created
    if (this.autoCreated && this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    // Set animationId to null
    this.animationId = null;
  }
}
