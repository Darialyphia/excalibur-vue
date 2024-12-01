import { ImageSource, Loader, SpriteSheet } from 'excalibur';
import { AsepriteResource } from '@excaliburjs/plugin-aseprite';

import boardTilemapPath from './assets/tilemap.png?url';
import movemementTilemapPath from './assets/movement_tilemap.png?url';

import hoveredCellPath from './assets/hovered-cell.aseprite?url';
import tileHighlightsPath from './assets/tile-highlights.aseprite?url';

import footmanPath from './assets/footman.aseprite?url';
import archerPath from './assets/archer.aseprite?url';
import paladinPath from './assets/paladin.aseprite?url';
import assasinPath from './assets/assassin.aseprite?url';
import tankPath from './assets/tank.aseprite?url';
import magePath from './assets/mage.aseprite?url';

const tilemapsResources = {
  boardTilemap: new ImageSource(boardTilemapPath),
  movementTilemap: new ImageSource(movemementTilemapPath)
} as const;

const uiResources = {
  hoveredCell: new AsepriteResource(hoveredCellPath),
  tileHighlights: new AsepriteResource(tileHighlightsPath)
} as const;

const unitResources = {
  footman: new AsepriteResource(footmanPath),
  paladin: new AsepriteResource(paladinPath),
  archer: new AsepriteResource(archerPath),
  assassin: new AsepriteResource(assasinPath),
  tank: new AsepriteResource(tankPath),
  mage: new AsepriteResource(magePath)
} as const;

export const resources = {
  ...tilemapsResources,
  ...uiResources,
  ...unitResources
} as const;

export const boardSheet = SpriteSheet.fromImageSource({
  image: resources.boardTilemap,
  grid: {
    rows: 4,
    columns: 4,
    spriteWidth: 64,
    spriteHeight: 64
  }
});
export const movementSheet = SpriteSheet.fromImageSource({
  image: resources.movementTilemap,
  grid: {
    rows: 7,
    columns: 7,
    spriteWidth: 64,
    spriteHeight: 64
  }
});

export const loader = new Loader();

for (const res of Object.values(resources)) {
  loader.addResource(res);
}
