---
issue: 5
title: Multi-Firework Support and Accessibility
analyzed: 2026-01-11T01:30:28Z
estimated_hours: 12
parallelization_factor: 1.0
---

# Parallel Work Analysis: Issue #5

## Overview
Enhance the firework library with robust multi-firework support (5-10 simultaneous fireworks maintaining 60fps) and comprehensive accessibility features including prefers-reduced-motion detection, reduced motion mode, and proper ARIA attributes. Ensure no performance degradation with multiple concurrent fireworks.

## Parallel Streams

### Single Stream: Multi-Firework & Accessibility Implementation
**Scope**: Implement all multi-firework and accessibility features in one cohesive stream
**Files**:
- `src/firework.js` (extend existing class)
**Agent Type**: general-purpose
**Can Start**: immediately
**Estimated Hours**: 12
**Dependencies**: none

**Detailed Work**:

**Part 1: Multi-Firework Support (Already Working)**
- Verify current implementation already supports multiple fireworks
  - Multiple launch() calls already append to particles array
  - Animation loop already continues until all particles fade
  - Test with 10 simultaneous fireworks
  - Validate 60fps performance with 500+ particles

**Part 2: Accessibility - Motion Preferences**
- Extend constructor to check prefers-reduced-motion
  ```javascript
  this.reducedMotion = options.reducedMotion !== undefined
    ? options.reducedMotion
    : window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  this.disableAnimations = options.disableAnimations || false;
  ```

- Implement reduced motion mode in launch()
  ```javascript
  if (this.disableAnimations) return;

  if (this.reducedMotion) {
    this._showStaticCelebration(x, y);
    return;
  }
  ```

- Implement `_showStaticCelebration(x, y)` method
  - Show brief static visual (circle or starburst)
  - Fade out after 300-500ms
  - No particle physics, just simple shape
  - Fire onLaunch and onComplete callbacks

**Part 3: Canvas Accessibility Attributes**
- Update `_createCanvas()` method
  - Add `aria-hidden="true"` attribute
  - Add `role="presentation"` attribute
  - Ensure `pointer-events: none` (already exists)
  - Add descriptive comment explaining accessibility

**Part 4: Performance Testing**
- Create test scenario in demo/test.html
  - Button for 10 simultaneous fireworks
  - FPS monitoring
  - Particle count display
  - Verify 60fps maintained

## Coordination Points

### Shared Files
Single file modified: `src/firework.js`

**Coordination Strategy**:
- Sequential implementation within single stream
- No parallel work needed - features are tightly coupled
- All changes in one cohesive commit

### Sequential Requirements
None - single stream handles all work

## Conflict Risk Assessment
- **No Risk**: Single stream, single file, sequential implementation

## Parallelization Strategy

**Recommended Approach**: sequential (single stream)

Multi-firework support is already mostly working (particles array accumulation by design). The main work is:
1. Verify and test multi-firework performance
2. Add accessibility features (motion preferences, ARIA)
3. Implement reduced motion mode
4. Performance testing and validation

All features are tightly coupled and modify the same methods, making parallel streams inefficient. Single focused stream is optimal.

## Expected Timeline

With single stream:
- Multi-firework verification: ~2 hours
- Accessibility features: ~6 hours
- Reduced motion mode: ~3 hours
- Testing and validation: ~1 hour
- **Wall time**: ~12 hours

## Notes
- Multi-firework support already exists by design (particles array accumulation)
- Main work is accessibility features and reduced motion mode
- Performance testing critical to validate 60fps with 10 fireworks
- ARIA attributes ensure canvas doesn't interfere with assistive technology
- Reduced motion mode respects user preferences while still providing feedback
- Default behavior should respect system preferences
- Developer override allows explicit control when needed
- Test with actual screen reader to verify accessibility
- Update demo/test.html to demonstrate reduced motion mode
