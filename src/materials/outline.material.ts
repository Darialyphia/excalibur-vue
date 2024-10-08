import { Engine } from 'excalibur';
import outlineFrag from './outline.frag.glsl?raw';

export const createOutlineMaterial = (game: Engine) =>
  game.graphicsContext.createMaterial({
    name: 'outline',
    fragmentSource: outlineFrag
  });
