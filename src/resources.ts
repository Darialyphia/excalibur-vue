import { ImageSource, Loader, SpriteSheet } from 'excalibur';
import { BG_COLOR } from './constants';

import mapSheetPath from './assets/tilemap.png?url';
import footmanPath from './assets/footman.aseprite?url';
import hoveredCellPath from './assets/hovered-cell.aseprite?url';
import { AsepriteResource } from '@excaliburjs/plugin-aseprite';

export const resources = {
  mapSheet: new ImageSource(mapSheetPath),
  footman: new AsepriteResource(footmanPath),
  hoveredCell: new AsepriteResource(hoveredCellPath)
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
