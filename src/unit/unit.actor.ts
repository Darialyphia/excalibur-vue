import { AsepriteResource } from '@excaliburjs/plugin-aseprite';
import { BoardPiece, BoardPieceOptions } from '../board/board-piece.actor';
import { UiState, UnitData } from '../App.vue';
import { Ref, watchEffect } from 'vue';
import { Engine, Material, vec, Vector } from 'excalibur';
import { createOutlineMaterial } from '../materials/outline.material';
import { ISO_TILE_HEIGHT } from '../constants';
import { BoardTile } from '../board/board-tile.entity';
import { manhattanDist } from '../utils/math';

export type UnitOptions = Omit<BoardPieceOptions, 'solid'> & {
  unitData: UnitData;
  uiState: Ref<UiState>;
};

export class Unit extends BoardPiece {
  private uiState: Ref<UiState>;

  private outlineMaterial!: Material;

  readonly unitData: UnitData;

  constructor(options: UnitOptions) {
    super({ ...options, solid: true });
    this.uiState = options.uiState;
    this.unitData = options.unitData;
    this.graphics.use(this.unitData.resource.getAnimation('idle')!);
    this.graphics.opacity = 0;
  }

  get speed() {
    return this.unitData.speed;
  }

  onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.outlineMaterial = createOutlineMaterial(engine);

    watchEffect(() => {
      const isSelected = this.uiState.value.selectedUnit?.equals(this);
      this.graphics.material = isSelected ? this.outlineMaterial : null;
    });

    this.graphics.opacity = 0;
    this.graphics.offset.y = -ISO_TILE_HEIGHT;

    gsap.to(this.graphics.offset, {
      y: 0,
      duration: 0.7,
      ease: Bounce.easeOut
    });
    gsap.to(this.graphics, { opacity: 1, duration: 0.2 });
  }

  canMoveTo(tile: BoardTile) {
    const dist = manhattanDist(tile.boardPosition, this.boardTile.boardPosition);

    return !tile.isOccupied && dist <= this.speed;
  }

  moveTo(pos: Vector) {
    const path: Vector[] = [];

    let x = this.boardPosition.x;
    let y = this.boardPosition.y;
    while (x !== pos.x || y !== pos.y) {
      if (x > pos.x) x--;
      else if (x < pos.x) x++;
      else if (y > pos.y) y--;
      else if (y < pos.y) y++;
      path.push(vec(x, y));
    }

    if (!path.length) return;

    const step = (vec: Vector) => {
      this.setBoardPosition(vec, 0.3, () => {
        const nextIndex = path.indexOf(vec) + 1;
        if (nextIndex >= path.length) return;
        step(path[nextIndex]);
      });
    };
    step(path[0]);
  }
}
