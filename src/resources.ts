import { ImageSource, Loader, SpriteSheet } from 'excalibur';
import { BG_COLOR } from './constants';

import mapSheetPath from './assets/tilemap.png?url';
import hoveredCellPath from './assets/hovered-cell.aseprite?url';
import { AsepriteResource } from '@excaliburjs/plugin-aseprite';

import footmanPath from './assets/footman.aseprite?url';
import archerPath from './assets/archer.aseprite?url';
import paladinPath from './assets/paladin.aseprite?url';

export const resources = {
  mapSheet: new ImageSource(mapSheetPath),
  hoveredCell: new AsepriteResource(hoveredCellPath),
  footman: new AsepriteResource(footmanPath),
  archer: new AsepriteResource(archerPath),
  paladin: new AsepriteResource(paladinPath)
} as const;

export const loader = new Loader();
loader.backgroundColor = BG_COLOR.toString();

export const mapSheet = SpriteSheet.fromImageSource({
  image: resources.mapSheet,
  grid: {
    rows: 4,
    columns: 4,
    spriteWidth: 64,
    spriteHeight: 64
  }
});

for (const res of Object.values(resources)) {
  loader.addResource(res);
}
