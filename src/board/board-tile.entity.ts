import { IsometricMap } from 'excalibur';
import { Board } from './board.entity';

export type AtlasCoords = [number, number];

export type BoardTileOptions = {
  atlasCoords: AtlasCoords;
  board: Board;
};

export class BoardTile {
  public readonly atlasCoords: AtlasCoords;

  private board: Board;

  constructor(options: BoardTileOptions) {
    this.atlasCoords = options.atlasCoords;
    this.board = options.board;
  }
}
