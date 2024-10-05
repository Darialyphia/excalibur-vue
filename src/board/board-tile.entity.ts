import { IsometricMap } from 'excalibur';
import { Board } from './board.entity';
import { getRotatedIndex, indexToPoint, RotationAngleDeg } from '../utils';

export type AtlasCoords = [number, number];

export type BoardTileOptions = {
  atlasCoords: AtlasCoords;
  board: Board;
  index: number;
};

export class BoardTile {
  public readonly atlasCoords: AtlasCoords;

  private board: Board;

  private _index: number;

  constructor(options: BoardTileOptions) {
    this.atlasCoords = options.atlasCoords;
    this.board = options.board;
    this._index = options.index;
  }

  get boardPosition() {
    return indexToPoint(this._index, this.board.baseColumns);
  }

  get index() {
    return getRotatedIndex(this.board.tiles, this._index, {
      width: this.board.baseColumns,
      angle: this.board.angle
    });
  }

  get isoTile() {
    const point = indexToPoint(this.index, this.board.columns);

    return this.board.getTileAt(point.x, point.y);
  }
}
