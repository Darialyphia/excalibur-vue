import { Actor, Engine, TransformComponent, vec, Vector } from 'excalibur';
import { Board } from '../board/board.entity';
import { getRotatedIndex, indexToPoint, pointToIndex } from '../utils';
import { AnyFunction } from '../types';

export type BoardPieceOptions = {
  board: Board;
  boardPosition: Vector;
  solid: boolean;
};

export class BoardPiece extends Actor {
  private board: Board;

  public zOffset = 1;

  protected boardPosition: Vector;

  readonly solid: boolean;

  constructor(options: BoardPieceOptions) {
    super();
    this.board = options.board;
    this.solid = options.solid;
    this.boardPosition = options.boardPosition;
  }

  onInitialize(_engine: Engine): void {
    this.setIsoPosition(0);

    this.board.events.on('rotate', () => {
      this.graphics.flipHorizontal = this.board.angle === 90 || this.board.angle === 180;
      this.setIsoPosition(0);
    });

    const sub = this.on('postupdate', () => {
      setTimeout(() => {
        this.z = this.boardTile.z + this.zOffset;
        sub.close();
      });
    });
  }

  get boardTile() {
    return this.board.tiles.find(tile => this.boardPosition.equals(tile.boardPosition))!;
  }

  equals(piece: BoardPiece) {
    return piece.id === this.id;
  }

  setBoardPosition(vec: Vector, duration = 0, cb?: AnyFunction) {
    this.boardPosition = vec;
    this.setIsoPosition(duration, cb);
  }

  private setIsoPosition(duration: number, cb?: AnyFunction) {
    const rotatedPoint = indexToPoint(
      getRotatedIndex(
        this.board.tiles,
        pointToIndex(this.boardPosition, this.board.baseColumns),
        {
          angle: this.board.angle,
          width: this.board.baseColumns
        }
      ),
      this.board.columns
    );
    const worldPos = this.board.tileToWorld(vec(rotatedPoint.x, rotatedPoint.y));

    const updateZ = () => {
      const tileCoords = this.board.worldToTileFloat(this.pos);
      const tile = this.board.getIsoTileAt(
        Math.ceil(tileCoords.x),
        Math.ceil(tileCoords.y)
      )!;
      this.z = tile.get(TransformComponent).z + this.zOffset;
    };

    gsap.to(this.pos, {
      x: worldPos.x,
      y: worldPos.y,
      duration,
      ease: Power2.easeInOut,
      onUpdate: updateZ,
      onComplete: () => {
        updateZ();
        cb?.();
      }
    });
  }
}
