/**
 * Firework - Interactive fireworks animation library
 */
export default class Firework {
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

    // Append to document body
    document.body.appendChild(canvas);

    // Return canvas element
    return canvas;
  }

  _createParticles(x, y, config = {}) {
    // Get particle count from config or use default
    const particleCount = config.particleCount || this.defaults.particleCount;

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

      // Create particle object
      particles.push({
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        color: '#ffffff',
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
    }
  }

  launch(x, y, overrides = {}) {
    // Merge overrides with defaults for config
    const config = { ...this.defaults, ...overrides };

    // Create new particles
    const newParticles = this._createParticles(x, y, config);

    // Add to particles array
    this.particles.push(...newParticles);

    // Start animation if not running
    if (!this.animationId) {
      this._animate();
    }
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
