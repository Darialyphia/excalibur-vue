import { Color } from 'excalibur';
import { mapRange } from './utils';
import { AtlasCoords } from './board/board-tile.entity';

export const DEBUG = false;

export const BG_COLOR = Color.fromHSL(mapRange(250, [0, 360], [0, 1]), 0.3, 0.25);

export const TILE_SIZE = 64;
export const MAP_ROWS = 7;
export const MAP_COLS = 11;
export const WIDTH = TILE_SIZE * MAP_COLS;
export const HEIGHT = TILE_SIZE * MAP_ROWS;

export const ISO_TILE_HEIGHT = 32;
export const ISO_TILE_WIDTH = 64;
export const ISO_MAP_WIDTH = ((MAP_ROWS + MAP_COLS) / 2) * ISO_TILE_WIDTH;
export const ISO_MAP_HEIGHT = ((MAP_ROWS + MAP_COLS) / 2) * ISO_TILE_HEIGHT;

type Tile = {
  atlasCoords: AtlasCoords;
  isWalkable: boolean;
};

const GRASS = (): Tile => ({ atlasCoords: [0, 0], isWalkable: true });
const DIRT = (): Tile => ({ atlasCoords: [1, 0], isWalkable: true });
const WATER = (): Tile => ({ atlasCoords: [0, 1], isWalkable: false });
// prettier-ignore
export const MAP = [
  DIRT() , GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(),
  GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(),
  GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(),
  DIRT() , DIRT() , DIRT() , DIRT() , DIRT() , DIRT() , DIRT() , DIRT() , DIRT() , DIRT() , DIRT() ,
  GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(),
  GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), WATER(), WATER(),
  GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), GRASS(), WATER(), WATER(),
];
