import { Actor, GraphicsComponent, TransformComponent, vec, Vector } from 'excalibur';
import { Board } from '../board/board.entity';
import { getRotatedIndex, indexToPoint, pointToIndex } from '../utils';

export type BoardPieceOptions = {
  board: Board;
  boardPosition: Vector;
};

export class BoardPieceActor extends Actor {
  private board: Board;

  private boardPosition: Vector;

  constructor(options: BoardPieceOptions) {
    super();
    this.board = options.board;
    this.boardPosition = options.boardPosition;
    this.board.events.on('rotate', () => {
      this.graphics.flipHorizontal = this.board.angle === 90 || this.board.angle === 180;
      this.setIsoPosition(0);
    });
    this.setIsoPosition(0);
  }

  setBoardPosition(vec: Vector, duration = 0) {
    this.boardPosition = vec;
    this.setIsoPosition(duration);
  }

  private setIsoPosition(duration: number) {
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
      const tile = this.board.getTileAt(
        Math.ceil(tileCoords.x),
        Math.ceil(tileCoords.y)
      )!;

      this.z = tile.get(TransformComponent).z + 1;
    };

    gsap.to(this.pos, {
      x: worldPos.x,
      y: worldPos.y,
      duration,
      ease: Power2.easeInOut,
      onUpdate: updateZ,
      onComplete: updateZ
    });
  }
}
