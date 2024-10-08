import { Vector } from 'excalibur';

export const manhattanDist = (vec1: Vector, vec2: Vector) => {
  return Math.abs(vec2.x - vec1.x) + Math.abs(vec2.y - vec1.y);
};
