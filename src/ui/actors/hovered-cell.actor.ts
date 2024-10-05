import { Actor, Engine, TransformComponent } from 'excalibur';
import { Board } from '../../board/board.entity';
import { resources } from '../../resources';

export class HoveredCellActor extends Actor {
  private board: Board;

  constructor(board: Board) {
    super({
      y: board.tileHeight / 2
    });
    this.graphics.use(resources.hoveredCell.getAnimation('idle')!);

    this.board = board;
  }

  onPreUpdate(engine: Engine) {
    const pos = engine.currentScene.input.pointers.primary.lastWorldPos;
    if (!pos) {
      this.unparent();
      return;
    }

    const tile = this.board.getTileByWorldPoint(pos);
    if (!tile) {
      this.unparent();
      return;
    }

    if (this.parent === tile || !tile.solid) return;
    this.unparent();
    tile.addChild(this);
    this.z = tile.get(TransformComponent).z;
  }
}
