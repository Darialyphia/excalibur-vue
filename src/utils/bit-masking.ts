import { Sprite, SpriteSheet } from 'excalibur';
import { BoardTile } from '../board/board-tile.entity';
import { Board } from '../board/board.entity';
import { indexToPoint, rotate } from '../utils';

// prettier-ignore
const neighborCoords: [number, number][][] = [
  [[-1, -1], [0, -1], [1, -1]],
  [[-1, 0],  [0, 0],  [1, 0]],
  [[-1, 1],  [0, 1],  [1, 1]]
]
// prettier-ignore
const weights = [
128, 1,  2 ,
64,  0,  4,
32,  16, 8
] as const

export const getBitMask = (
  board: Board,
  tile: BoardTile,
  compareFn: (neighbor: BoardTile | undefined) => boolean
) => {
  const rotatedNeighbors = rotate(neighborCoords, board.angle).flat();

  const getCell = (neighborIndex: number) => {
    const [diffX, diffY] = rotatedNeighbors[neighborIndex];

    const neighbor = board.getTileAt(
      tile.boardPosition.x + diffX,
      tile.boardPosition.y + diffY
    );

    return neighbor;
  };

  const [topLeft, top, topRight, left, center, right, bottomLeft, bottom, bottomRight] =
    rotatedNeighbors.map((_, index) => getCell(index));

  // precompute edges so we dont run the compare function multiple times as bitMasking can be called A LOT in the UI
  const matchTop = compareFn(top);
  const matchBottom = compareFn(bottom);
  const matchLeft = compareFn(left);
  const matchRight = compareFn(right);

  // for a corner to match, both of its sides must match as well
  // see https://gamedevelopment.tutsplus.com/how-to-use-tile-bitmasking-to-auto-tile-your-level-layouts--cms-25673t
  const weight = [
    matchLeft && matchTop && compareFn(topLeft),
    matchTop,
    matchRight && matchTop && compareFn(topRight),
    matchLeft,
    compareFn(center),
    matchRight,
    matchLeft && matchBottom && compareFn(bottomLeft),
    matchBottom,
    matchRight && matchBottom && compareFn(bottomRight)
  ].reduce((weight, match, index) => {
    return match ? weight + weights[index] : weight;
  }, 0);

  return weight;
};

// see http://www.cr31.co.uk/stagecast/wang/blob.html
export const BITMASK_TO_INDEX_DICT = {
  0: 0,
  4: 1,
  92: 2,
  124: 3,
  116: 4,
  80: 5,
  // no index 6: tile not used
  16: 7,
  20: 8,
  87: 9,
  223: 10,
  241: 11,
  21: 12,
  64: 13,
  29: 14,
  117: 15,
  85: 16,
  71: 17,
  221: 18,
  125: 19,
  112: 20,
  31: 21,
  253: 22,
  113: 23,
  28: 24,
  127: 25,
  247: 26,
  209: 27,
  23: 28,
  199: 29,
  213: 30,
  95: 31,
  255: 32,
  245: 33,
  81: 34,
  5: 35,
  84: 36,
  93: 37,
  119: 38,
  215: 39,
  193: 40,
  17: 41,
  // no index 42: tile not used
  1: 43,
  7: 44,
  197: 45,
  69: 46,
  68: 47,
  65: 48
} as const;

export const getTextureIndexFromBitMask = (
  bitMask: number,
  spritesheet: SpriteSheet
): Sprite => {
  const bitMaskIndex =
    BITMASK_TO_INDEX_DICT[bitMask as keyof typeof BITMASK_TO_INDEX_DICT];

  const { x, y } = indexToPoint(bitMaskIndex, spritesheet.columns);

  return spritesheet.getSprite(x, y);
};
