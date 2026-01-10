---
name: html-fireword
status: backlog
created: 2026-01-10T15:39:13Z
progress: 0%
prd: .claude/prds/html-fireword.md
github: https://github.com/TuanPhuong2020/html-fireword/issues/1
---

# Epic: html-fireword

## Overview

Build a lightweight (~10KB gzipped), zero-dependency JavaScript library for Canvas-based firework animations. The library will provide a simple API (`new Firework(options)`, `launch(x, y)`) that developers can integrate in under 15 minutes. Core focus is on performance (60fps), accessibility (prefers-reduced-motion support), and simplicity over extensive customization.

## Architecture Decisions

**Canvas-based Rendering**
- Use Canvas 2D API for particle rendering (no WebGL complexity for v1)
- Rationale: Excellent browser support, sufficient performance for particle counts, simpler implementation

**Zero External Dependencies**
- Pure vanilla JavaScript (ES6+) implementation
- Rationale: Minimizes bundle size, eliminates supply chain vulnerabilities, reduces maintenance burden

**Particle System Architecture**
- Single Firework class manages canvas lifecycle and rendering loop
- Particle objects as lightweight data structures (position, velocity, color, alpha)
- requestAnimationFrame loop for 60fps rendering
- Gravity and fade applied per-frame to each particle

**Configuration Strategy**
- Sensible defaults for zero-config usage
- Optional overrides via constructor and launch method
- Focus on color customization (primary user need from PRD)

**Build Tooling**
- Rollup for bundling (optimized for libraries)
- Terser for minification
- TypeScript definitions for IDE autocomplete (even if source is JS)

## Technical Approach

### Frontend Components

**Core Firework Class**
```javascript
class Firework {
  constructor(options = {})  // Canvas element, default colors, particle config
  launch(x, y, overrides)     // Trigger explosion at coordinates
  stop()                      // Cleanup and remove canvas
  _animate()                  // Internal RAF loop
  _createParticles(x, y)      // Generate particle array
  _updateParticles()          // Apply physics per frame
  _render()                   // Draw particles to canvas
}
```

**Particle Data Structure**
- Simple objects: `{ x, y, vx, vy, color, alpha, life }`
- No class overhead for performance
- Pooling not needed for v1 (add if profiling shows GC pressure)

**Physics Simulation**
- Gravity constant applied to vertical velocity
- Alpha decay over time for fade-out effect
- Remove particles when alpha reaches 0

**Color System**
- Support hex colors, RGB arrays, and predefined palettes
- Random color selection from palette for multi-color fireworks
- Single color mode for brand consistency

### Backend Services

**N/A** - This is a client-side only library with no backend requirements.

### Infrastructure

**Package Distribution**
- npm package as primary distribution
- UMD bundle for CDN usage (unpkg, jsdelivr)
- ES module and CommonJS builds

**Build Pipeline**
- `npm run build` generates dist/ folder with:
  - `firework.js` (UMD, development)
  - `firework.min.js` (UMD, production)
  - `firework.esm.js` (ES module)
  - `firework.d.ts` (TypeScript definitions)

**Demo/Documentation Site**
- Simple HTML file in `demo/` folder with live examples
- Hosted on GitHub Pages
- Shows basic usage, color customization, and event triggers

**Performance Monitoring**
- Bundle size tracking in CI (fail if >10KB gzipped)
- FPS counter in demo for visual validation
- Lighthouse performance audit on demo page

## Implementation Strategy

**Phase 1: Core Engine (Week 1-2)**
1. Set up project structure and build tooling
2. Implement Firework class with basic particle system
3. Add gravity physics and fade-out animations
4. Validate 60fps performance with 100+ particles

**Phase 2: API & Customization (Week 2-3)**
1. Implement color customization options
2. Add event callbacks (onLaunch, onComplete)
3. Support multiple simultaneous fireworks
4. Add accessibility (prefers-reduced-motion)

**Phase 3: Polish & Distribution (Week 3-4)**
1. Create demo page with examples
2. Write quickstart documentation and API reference
3. Cross-browser testing (Chrome, Firefox, Safari, Edge)
4. Mobile device testing and optimization
5. Publish to npm

**Risk Mitigation**
- Performance risk: Early prototype validates Canvas can hit 60fps target
- Browser compatibility risk: Use only well-supported Canvas 2D APIs, test on target browsers
- Bundle size risk: Monitor during development, avoid heavy dependencies

**Testing Approach**
- Unit tests for physics calculations (velocity, alpha decay)
- Integration tests for API surface (Firework class methods)
- Visual regression tests for rendering (optional, manual for v1)
- Performance benchmarks (FPS measurement, bundle size)
- Cross-browser manual testing on target browsers

## Task Breakdown Preview

High-level task categories for implementation:

- [ ] **Project Setup**: Initialize npm package, configure Rollup build, set up TypeScript definitions, create repo structure
- [ ] **Core Particle Engine**: Implement Firework class, particle physics (gravity, velocity), RAF animation loop, canvas rendering
- [ ] **API & Configuration**: Add color customization, event callbacks, multi-firework support, accessibility features
- [ ] **Demo & Documentation**: Create interactive demo page, write quickstart guide, document API methods and options
- [ ] **Testing & Optimization**: Write unit tests, cross-browser testing, performance profiling, bundle size optimization
- [ ] **Distribution**: Publish to npm, set up GitHub Pages demo, create README with examples

## Dependencies

### External Dependencies

**Runtime Dependencies**
- None (zero-dependency vanilla JS)

**Development Dependencies**
- Rollup (bundling)
- Rollup plugins: terser, commonjs, node-resolve
- TypeScript (type definitions only)
- Jest (unit testing)
- Playwright (cross-browser testing)

**Browser Requirements**
- Canvas 2D API support
- requestAnimationFrame support
- ES6+ JavaScript runtime
- All modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)

### Internal Team Dependencies

**Development**
- Single frontend engineer for implementation

**Design Input**
- Default color palette review (one-time consultation)
- Demo page aesthetics feedback

**Quality Assurance**
- Accessibility review for prefers-reduced-motion implementation
- Performance validation on low-end mobile devices
- Security review for configuration sanitization

### External Stakeholders

**Beta Testers**
- 5-10 early adopters from developer community
- Feedback on API ergonomics and integration experience

**Performance Testing**
- Test on range of devices (high-end desktop to mid-range mobile)
- Validate 60fps target across device spectrum

## Success Criteria (Technical)

**Performance Benchmarks**
- Maintain 60fps with 5 simultaneous fireworks (50 particles each)
- Bundle size < 10KB minified + gzipped
- Time-to-interactive impact < 50ms
- Zero memory leaks after 100 consecutive launches

**Quality Gates**
- All unit tests passing (90%+ code coverage)
- Zero console errors in Chrome, Firefox, Safari, Edge
- Successful manual test on iOS Safari and Chrome Mobile
- Accessibility: prefers-reduced-motion respected, no screen reader interference

**Developer Experience**
- Integration from npm install to first firework < 15 minutes
- API documentation complete with code examples
- Demo page shows 3+ usage examples

**Acceptance Criteria**
- Emily persona can integrate in 15 minutes ✓
- Fireworks render smoothly on Marcus's devices ✓
- Library works in SPA without memory leaks ✓
- Customization limited to colors only (simplified scope) ✓

## Estimated Effort

**Overall Timeline: 4 weeks**

**Week 1: Foundation**
- Project setup and build configuration (1 day)
- Core particle engine and physics (3 days)
- Initial performance validation (1 day)

**Week 2: Features**
- Color customization system (2 days)
- Multi-firework support (1 day)
- Accessibility implementation (1 day)
- Event callbacks (1 day)

**Week 3: Quality**
- Unit test suite (2 days)
- Cross-browser testing (2 days)
- Performance optimization (1 day)

**Week 4: Launch Prep**
- Demo page and documentation (2 days)
- Final polish and bug fixes (2 days)
- npm publish and release (1 day)

**Resource Requirements**
- 1 frontend engineer (full-time)
- Designer review (2 hours total)
- QA testing support (4 hours)

**Critical Path Items**
1. Core particle engine performance validation (blocks everything)
2. API design finalization (blocks documentation and tests)
3. Cross-browser testing (blocks release)
4. Bundle size optimization (blocks npm publish)

## Tasks Created

- [ ] #2 - Project Setup and Build Configuration (parallel: true)
- [ ] #3 - Core Particle Engine Implementation (parallel: false)
- [ ] #4 - Color Customization and Configuration System (parallel: false)
- [ ] #5 - Multi-Firework Support and Accessibility (parallel: false)
- [ ] #6 - Testing and Cross-Browser Validation (parallel: false)
- [ ] #7 - Demo Page, Documentation, and npm Publishing (parallel: false)

**Total tasks**: 6
**Parallel tasks**: 1 (Task #2 can start immediately)
**Sequential tasks**: 5 (Tasks #3-7 have dependencies)
**Estimated total effort**: 70-92 hours (~3-4 weeks for single developer)
