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

  launch(x, y, overrides = {}) {
    // TODO: Implementation in next task
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
