# 🎆 html-fireword

[![npm version](https://img.shields.io/npm/v/html-fireword.svg)](https://www.npmjs.com/package/html-fireword)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/html-fireword)](https://bundlephobia.com/package/html-fireword)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight (~2.5KB gzipped), zero-dependency JavaScript library for creating beautiful firework animations on HTML canvas. Perfect for celebrations, achievements, and adding visual delight to your web applications.

## ✨ Features

- 🎨 **Customizable Colors** - Hex, RGB, or predefined palettes (rainbow, fire, ocean, monochrome)
- 🎯 **Multiple Fireworks** - Launch up to 10 simultaneous fireworks at 60fps
- ♿ **Accessible** - Respects `prefers-reduced-motion` with static celebration mode
- 🎭 **Event Callbacks** - Hook into launch and completion events
- 📦 **Tiny Bundle** - Only ~2.5KB gzipped, zero dependencies
- 🌐 **Universal** - Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- 📱 **Mobile-Friendly** - Optimized for touch devices

## 🚀 Quick Start

### Installation

```bash
npm install html-fireword
```

Or use via CDN:

```html
<script type="module">
  import Firework from 'https://unpkg.com/html-fireword@1.0.0/dist/firework.esm.js';
</script>
```

### Basic Usage

```javascript
import Firework from 'html-fireword';

// Create a firework instance
const firework = new Firework();

// Launch on click
document.addEventListener('click', (e) => {
  firework.launch(e.clientX, e.clientY);
});
```

**That's it!** Click anywhere to see fireworks 🎆

## 📖 Documentation

### Constructor Options

```javascript
const firework = new Firework({
  // Color configuration
  colors: 'rainbow',           // 'rainbow', 'fire', 'ocean', 'monochrome', hex string, RGB array, or array of colors
  colorMode: 'multi',          // 'single' or 'multi' - single uses first color for all particles

  // Accessibility
  reducedMotion: false,        // Auto-detects prefers-reduced-motion, can override
  disableAnimations: false,    // Completely disable animations

  // Event callbacks
  onLaunch: (x, y) => {},      // Fires when firework launches
  onComplete: () => {},        // Fires when all particles fade

  // Advanced (optional)
  canvas: null,                // Provide your own canvas element (auto-creates if not provided)
  particleCount: 50,           // Number of particles per firework
  gravity: 0.1,                // Gravity strength
  fadeSpeed: 0.02              // How fast particles fade out
});
```

### Methods

#### `launch(x, y, [overrides])`

Launch a firework at the specified coordinates.

```javascript
// Basic launch
firework.launch(400, 300);

// Override colors for this launch only
firework.launch(400, 300, {
  colors: '#ff0000',  // Red firework
  particleCount: 100  // Extra particles
});
```

#### `stop()`

Stop all animations and clean up.

```javascript
firework.stop();
```

## 🎨 Color Examples

### Predefined Palettes

```javascript
// Rainbow colors (default)
const fw1 = new Firework({ colors: 'rainbow' });

// Fire colors (orange/yellow gradient)
const fw2 = new Firework({ colors: 'fire' });

// Ocean colors (blue tones)
const fw3 = new Firework({ colors: 'ocean' });

// Monochrome (white)
const fw4 = new Firework({ colors: 'monochrome' });
```

### Custom Colors

```javascript
// Single hex color
const fw5 = new Firework({ colors: '#ff0000' });

// RGB array
const fw6 = new Firework({ colors: [0, 255, 0] });

// Custom palette
const fw7 = new Firework({
  colors: [[255, 0, 0], [0, 255, 0], [0, 0, 255]]
});
```

### Color Modes

```javascript
// Multi-color: each particle gets random color from palette
const fw8 = new Firework({
  colors: 'rainbow',
  colorMode: 'multi'  // Default
});

// Single-color: all particles use first color
const fw9 = new Firework({
  colors: 'rainbow',
  colorMode: 'single'
});
```

## ♿ Accessibility

The library automatically detects and respects the `prefers-reduced-motion` CSS media query.

```javascript
// Auto-detect system preference (default behavior)
const fw = new Firework();

// Manually enable reduced motion
const fw2 = new Firework({ reducedMotion: true });

// Completely disable animations
const fw3 = new Firework({ disableAnimations: true });
```

When reduced motion is enabled, fireworks show a brief static celebration (radial gradient circle) instead of particle animation.

## 🎯 Event Callbacks

```javascript
const firework = new Firework({
  onLaunch: (x, y) => {
    console.log(`Firework launched at (${x}, ${y})`);
    // Play sound, update UI, etc.
  },
  onComplete: () => {
    console.log('All particles have faded');
    // Trigger next animation, etc.
  }
});

firework.launch(400, 300);
```

## 🎭 Multiple Fireworks

Launch multiple fireworks simultaneously:

```javascript
const firework = new Firework();

// Launch 5 fireworks in random positions
for (let i = 0; i < 5; i++) {
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  firework.launch(x, y);
}
```

Performance: Maintains 60fps with up to 10 simultaneous fireworks (500+ particles).

## 📦 Bundle Formats

The library is distributed in multiple formats:

- **ESM**: `dist/firework.esm.js` - For modern bundlers and `<script type="module">`
- **UMD**: `dist/firework.js` - For browsers and Node.js
- **UMD (minified)**: `dist/firework.min.js` - Production build
- **CommonJS**: `dist/firework.cjs.js` - For older Node.js

## 🌐 Browser Support

- Chrome/Edge 119+
- Firefox 120+
- Safari 17+
- iOS Safari 16+
- Chrome Mobile (Android)

All modern browsers with Canvas 2D API and ES6+ support.

## ⚡ Performance

- **Bundle Size**: ~2.5KB gzipped (< 10KB target)
- **FPS**: 60fps with 250+ particles
- **Memory**: Zero leaks detected
- **Optimization**: Lightweight particle objects, efficient rendering

See [tests/PERFORMANCE.md](tests/PERFORMANCE.md) for detailed benchmarks.

## 🧪 Testing

See [tests/TESTING.md](tests/TESTING.md) for cross-browser testing guide.

## 📝 API Reference

For complete API documentation, see [API.md](API.md).

## 🎮 Examples

Check out the demo pages:
- [Basic Demo](demo/test.html) - Interactive examples with FPS counter
- [Accessibility Demo](demo/test-accessibility.html) - Reduced motion testing

## 📄 License

MIT © 2026

## 🤝 Contributing

Contributions welcome! Please open an issue or PR on [GitHub](https://github.com/TuanPhuong2020/html-fireword).

## 🙏 Credits

Built with Claude Code using the CCPM (Claude Code Project Manager) framework.

---

**Enjoy creating delightful celebrations!** 🎆✨
