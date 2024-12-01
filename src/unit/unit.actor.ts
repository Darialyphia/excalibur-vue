import outlineFrag from '@/shaders/outline.frag.glsl?raw';
import { BoardPiece, BoardPieceOptions } from '../board/board-piece.actor';
import { UiState, UnitData } from '../App-old.vue';
import { Ref, watchEffect } from 'vue';
import { Engine, EventEmitter } from 'excalibur';
import { ISO_TILE_HEIGHT } from '../constants';
import { BoardTile } from '../board/board-tile.entity';
import { manhattanDist } from '../utils/math';
import { ActorEvents } from 'excalibur/build/dist/Actor';
import { Pathfinder } from '../pathfinding/pathfinder';

export type UnitOptions = Omit<BoardPieceOptions, 'solid'> & {
  unitData: UnitData;
  uiState: UiState;
  pathfinder: Pathfinder;
};

type UnitEvents = {
  moved: {};
};

export class Unit extends BoardPiece {
  private uiState: UiState;

  private pathfinder: Pathfinder;

  readonly unitData: UnitData;

  zOffset = 20;

  readonly events: EventEmitter<ActorEvents & UnitEvents>;

  constructor(options: UnitOptions) {
    super({ ...options, solid: true });
    this.events = new EventEmitter();
    this.uiState = options.uiState;
    this.unitData = options.unitData;
    this.pathfinder = options.pathfinder;
  }

  get speed() {
    return this.unitData.speed;
  }

  onInitialize(engine: Engine) {
    super.onInitialize(engine);

    const outlineMaterial = engine.graphicsContext.createMaterial({
      name: 'outline',
      fragmentSource: outlineFrag
    });

    watchEffect(() => {
      const isSelected = this.uiState.selectedUnit.value?.equals(this);
      this.graphics.material = isSelected ? outlineMaterial : null;
    });

    this.graphics.use(this.unitData.resource.getAnimation('idle')!);
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
    const path = this.pathfinder.getPath(this.boardTile, tile);
    return path.length && path.length <= this.speed;
  }

  moveTo(tile: BoardTile) {
    const path = this.pathfinder.getPath(this.boardTile, tile);
    if (!path.length || path.length > this.speed) return;

    const step = (tile: BoardTile) => {
      this.setBoardPosition(tile.boardPosition, 0.3, () => {
        this.events.emit('moved');
        const nextIndex = path.indexOf(tile) + 1;
        if (nextIndex >= path.length) {
          return;
        }
        step(path[nextIndex]);
      });
    };
    step(path[0]);
  }
}
