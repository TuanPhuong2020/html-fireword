/**
 * Firework - Interactive fireworks animation library
 */

export interface FireworkOptions {
  [key: string]: any;
}

export interface FireworkOverrides {
  [key: string]: any;
}

export default class Firework {
  /**
   * Creates a new Firework instance
   * @param options - Configuration options for the firework
   */
  constructor(options?: FireworkOptions);

  /**
   * Launch a firework at the specified coordinates
   * @param x - The x-coordinate
   * @param y - The y-coordinate
   * @param overrides - Optional overrides for this specific launch
   */
  launch(x: number, y: number, overrides?: FireworkOverrides): void;

  /**
   * Stop the firework animation
   */
  stop(): void;
}
