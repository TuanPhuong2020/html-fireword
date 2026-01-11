---
issue: 4
title: Color Customization and Configuration System
analyzed: 2026-01-11T00:46:04Z
estimated_hours: 14
parallelization_factor: 2.0
---

# Parallel Work Analysis: Issue #4

## Overview
Implement comprehensive color customization system with support for hex colors, RGB arrays, predefined palettes, single/multi-color modes, and event callbacks (onLaunch, onComplete). This enhances the firework library with flexible color options and developer hooks for integration.

## Parallel Streams

### Stream A: Color Parsing & Palette System
**Scope**: Implement color parsing utilities and predefined color palettes
**Files**:
- `src/firework.js` (extend existing class)
**Agent Type**: general-purpose
**Can Start**: immediately
**Estimated Hours**: 7
**Dependencies**: none

**Detailed Work**:
- Implement `_parseColors(colors)` utility method
  - Handle hex color strings (e.g., "#ff0000")
    - Parse "#RRGGBB" format to [R, G, B]
    - Validate hex format
  - Handle RGB arrays (e.g., [255, 0, 0])
    - Validate values are 0-255
  - Handle predefined palette names (strings)
    - Map to palette arrays
  - Handle array of colors (return as-is if valid)
  - Fallback to default 'rainbow' on invalid input
  - Return array of RGB arrays: [[r,g,b], ...]

- Define predefined color palettes as class property or constant
  - rainbow: [[255,0,0], [255,127,0], [255,255,0], [0,255,0], [0,0,255], [75,0,130], [148,0,211]]
  - fire: [[255,69,0], [255,140,0], [255,215,0], [255,255,0]]
  - ocean: [[0,119,190], [0,180,216], [144,224,239]]
  - monochrome: [[255,255,255]]

- Implement `_rgbToString(rgb)` helper method
  - Convert [r,g,b] to "rgb(r,g,b)" string
  - Used during rendering

- Extend constructor to accept color options
  - Accept `colors` option (defaults to 'rainbow')
  - Accept `colorMode` option: 'single' or 'multi' (defaults to 'multi')
  - Parse colors on initialization
  - Store parsed palette: `this.colorPalette`
  - Store color mode: `this.colorMode`

### Stream B: Event Callbacks & Color Integration
**Scope**: Implement event callback system and integrate colors into particle system
**Files**:
- `src/firework.js` (extend existing class)
**Agent Type**: general-purpose
**Can Start**: immediately (can work on different methods)
**Estimated Hours**: 7
**Dependencies**: none (works on different parts)

**Detailed Work**:
- Extend constructor for event callbacks
  - Accept `onLaunch` callback option
  - Accept `onComplete` callback option
  - Store callbacks: `this.onLaunch`, `this.onComplete`

- Update `launch(x, y, overrides)` method
  - Merge color overrides if provided
  - Parse override colors using `_parseColors()`
  - Fire `onLaunch(x, y)` callback if defined
  - Pass color palette to `_createParticles()`

- Update `_createParticles(x, y, config)` method
  - Accept color palette in config
  - For each particle:
    - If colorMode === 'single': use first color from palette
    - If colorMode === 'multi': randomly select color from palette
    - Convert RGB to string: `_rgbToString(rgb)`
    - Set particle.color to rgb string

- Update `_animate()` method
  - Detect when all particles are gone
  - Fire `onComplete()` callback if defined
  - Only fire once per animation sequence

## Coordination Points

### Shared Files
Both streams modify the same file: `src/firework.js`

**Coordination Strategy**:
- Stream A: Adds color parsing methods and extends constructor for color options
- Stream B: Adds callback system and integrates colors into particle lifecycle
- Minimal overlap - different methods being modified
- Both can work simultaneously with periodic commits

### Sequential Requirements
None - streams are independent and can run fully in parallel

**Integration Points**:
- Stream B uses `_parseColors()` from Stream A
- Both extend the constructor - need to merge options handling
- Final integration test needed after both complete

## Conflict Risk Assessment
- **Low Risk**: Streams work on different methods mostly
- Both extend constructor - needs careful merge
- `_createParticles()` modified by Stream B only
- `launch()` modified by Stream B only
- Git merge should be straightforward with frequent commits

## Parallelization Strategy

**Recommended Approach**: parallel

Launch both streams (A and B) simultaneously. They work on largely independent functionality:
- Stream A: Color parsing infrastructure
- Stream B: Callbacks and color application

**Integration Step**: After both complete (1-2 hours)
- Merge all work
- Test color customization with all formats
- Test event callbacks
- Validate backwards compatibility

## Expected Timeline

With parallel execution:
- Streams A & B in parallel: ~7 hours (both similar size)
- Integration & testing: ~2 hours
- **Wall time**: ~9 hours

Without parallel execution:
- Stream A: 7 hours
- Stream B: 7 hours
- Integration: 2 hours
- **Wall time**: 16 hours

**Efficiency gain**: 44% (9h vs 16h)

## Notes
- Both streams work on same file but different methods
- Color parsing (Stream A) is used by Stream B, but can be integrated during merge
- Event callbacks are independent of color system
- Backwards compatibility important: existing code should work without color options
- Test with all color formats: hex, RGB, palette names, arrays
- Validate color mode switching (single vs multi)
- Ensure callbacks fire at correct times
- Update demo/test.html to demonstrate new features after completion
