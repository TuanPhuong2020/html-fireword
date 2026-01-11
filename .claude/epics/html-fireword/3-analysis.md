---
issue: 3
title: Core Particle Engine Implementation
analyzed: 2026-01-11T00:33:26Z
estimated_hours: 18
parallelization_factor: 1.5
---

# Parallel Work Analysis: Issue #3

## Overview
Implement the complete particle engine for the html-fireword library including the Firework class with canvas management, particle physics (gravity, velocity), animation loop using requestAnimationFrame, and rendering. This is a large implementation task that can be broken into logical components.

## Parallel Streams

### Stream A: Core Class Structure & Canvas Management
**Scope**: Implement Firework class constructor, canvas creation/management, and cleanup methods
**Files**:
- `src/firework.js` (extend existing skeleton)
**Agent Type**: general-purpose
**Can Start**: immediately
**Estimated Hours**: 6
**Dependencies**: none

**Detailed Work**:
- Implement constructor with options parameter
  - Accept canvas element or auto-create one
  - Initialize particle array
  - Set default configuration (particleCount: 50, gravity: 0.1, fadeSpeed: 0.02)
  - Store canvas context reference
- Implement `_createCanvas()` method
  - Create canvas element dynamically
  - Set as fullscreen overlay (position: fixed, top: 0, left: 0)
  - Set width/height to window dimensions
  - Add pointer-events: none (don't block interactions)
  - Append to document.body
- Implement `stop()` method
  - Cancel animation frame if running
  - Clear particles array
  - Remove canvas from DOM if auto-created
  - Clean up references

### Stream B: Particle Physics & Animation Loop
**Scope**: Implement particle generation, physics updates, and requestAnimationFrame loop
**Files**:
- `src/firework.js` (extend existing skeleton)
**Agent Type**: general-purpose
**Can Start**: after Stream A completes (needs class structure)
**Estimated Hours**: 8
**Dependencies**: Stream A

**Detailed Work**:
- Implement `_createParticles(x, y, config)` method
  - Generate array of particle objects
  - Particle structure: `{ x, y, vx, vy, color, alpha, life }`
  - Random velocities in 360° circular pattern
  - Velocity magnitude: random between 5-10 pixels/frame
  - Initial alpha: 1.0, initial life: 1.0
  - Use Math.cos/sin for circular distribution
- Implement `_updateParticles()` method
  - Apply gravity to each particle: `particle.vy += this.gravity`
  - Update positions: `particle.x += particle.vx`, `particle.y += particle.vy`
  - Apply alpha decay: `particle.alpha -= this.fadeSpeed`
  - Filter out dead particles (alpha <= 0)
- Implement `_animate()` method
  - Use requestAnimationFrame for loop
  - Call `_updateParticles()` then `_render()`
  - Stop animation when particles array is empty
  - Store animationId for cancellation
- Implement `launch(x, y, overrides)` method
  - Create new particles and add to array
  - Start animation loop if not already running
  - Accept override config for particle count, colors, etc.

### Stream C: Canvas Rendering
**Scope**: Implement particle rendering to canvas using Canvas 2D API
**Files**:
- `src/firework.js` (extend existing skeleton)
**Agent Type**: general-purpose
**Can Start**: after Stream A completes (needs canvas context)
**Estimated Hours**: 4
**Dependencies**: Stream A

**Detailed Work**:
- Implement `_render()` method
  - Clear canvas: `ctx.clearRect(0, 0, width, height)`
  - Set composite operation for glow effect (optional)
  - Loop through particles array
  - For each particle:
    - Set fill style with color and alpha
    - Draw circle at (x, y) with radius 2-3px
    - Use `ctx.arc()` and `ctx.fill()`
  - Consider adding trail effect (optional for v1)
- Add rendering optimizations:
  - Use `ctx.save()` and `ctx.restore()` for state management
  - Batch similar operations if possible
  - Ensure smooth rendering at 60fps

## Coordination Points

### Shared Files
All streams modify the same file: `src/firework.js`

**Coordination Strategy**:
- Stream A runs first and creates the class structure foundation
- Streams B and C can run in parallel after A completes
- Stream B adds methods: `_createParticles()`, `_updateParticles()`, `_animate()`, `launch()`
- Stream C adds method: `_render()`
- These methods don't overlap, so B and C are safe to run concurrently

### Sequential Requirements
1. Stream A must complete first (creates class structure and canvas management)
2. Streams B and C can run in parallel after A
3. Final integration test after all streams complete

## Conflict Risk Assessment
- **Low-Medium Risk**: All streams modify the same file, but different methods
- Stream A lays foundation, B and C add non-overlapping functionality
- Clear method boundaries reduce conflict risk
- Git merge should be straightforward if agents commit frequently

## Parallelization Strategy

**Recommended Approach**: hybrid

**Phase 1**: Run Stream A first (6 hours)
- Must complete to provide foundation

**Phase 2**: Run Streams B and C in parallel (8 hours max)
- Stream B: Physics and animation (8h)
- Stream C: Rendering (4h)
- Can work simultaneously on different methods

**Phase 3**: Integration and testing (2 hours)
- Merge all work
- Test complete firework functionality
- Validate performance (60fps with 100+ particles)

## Expected Timeline

With parallel execution:
- Phase 1 (Stream A): 6 hours
- Phase 2 (Streams B + C in parallel): 8 hours (max of the two)
- Phase 3 (Integration): 2 hours
- **Wall time**: ~16 hours

Without parallel execution:
- Stream A: 6 hours
- Stream B: 8 hours
- Stream C: 4 hours
- Integration: 2 hours
- **Wall time**: 20 hours

**Efficiency gain**: 20% (16h vs 20h)

## Notes
- Stream A is critical path and must complete first
- Streams B and C have no dependencies on each other
- All work on single file requires careful git commit coordination
- Performance testing is essential after integration
- May need iteration on physics constants (gravity, fade speed) during testing
- Consider creating simple test HTML file for manual browser testing
