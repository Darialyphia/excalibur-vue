import { Component, Entity, TransformComponent, vec } from 'excalibur';
import { Board } from './board.entity';
import { getRotatedIndex, indexToPoint } from '../utils';

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

  addChild<T extends Component>(entity: Entity<T>) {
    this.isoTile.addChild(entity);

    return entity;
  }

  get z() {
    return this.isoTile.get(TransformComponent).z;
  }

  get boardPosition() {
    const point = indexToPoint(this._index, this.board.baseColumns);
    return vec(point.x, point.y);
  }

  get index() {
    return getRotatedIndex(this.board.tiles, this._index, {
      width: this.board.baseColumns,
      angle: this.board.angle
    });
  }

  get isoTile() {
    const point = indexToPoint(this.index, this.board.columns);

    return this.board.getIsoTileAt(point.x, point.y)!;
  }

  get isOccupied() {
    return this.board.pieces.some(piece => piece.solid && piece.boardTile?.equals(this));
  }

  get boardPieces() {
    return this.board.pieces.filter(piece => piece.boardTile?.equals(this));
  }

  equals(tile: BoardTile) {
    return this.boardPosition.equals(tile.boardPosition);
  }
}
