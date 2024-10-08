import { Actor, Engine, TransformComponent, vec } from 'excalibur';
import { Board } from '../../board/board.entity';
import { resources } from '../../resources';
import { UiState } from '../../App.vue';
import { Ref, watch, watchEffect } from 'vue';
import { ISO_TILE_HEIGHT } from '../../constants';

export class HoveredCell extends Actor {
  private board: Board;

  private uiState: Ref<UiState>;

  constructor(board: Board, uiState: Ref<UiState>) {
    super({
      y: board.tileHeight / 2
    });

    this.board = board;
    this.uiState = uiState;
  }

  onInitialize() {
    this.graphics.use(resources.hoveredCell.getAnimation('idle')!, {
      offset: vec(0, ISO_TILE_HEIGHT / 2)
    });

    watch(
      () => this.uiState.value.selectedUnitData,
      unitData => {
        if (!unitData) {
          this.removeAllChildren();
          return;
        }

        const preview = new Actor();
        preview.z = this.z;
        preview.graphics.opacity = 0.5;
        preview.graphics.use(unitData.resource.getAnimation('idle')!);
        this.addChild(preview);
      }
    );
  }

  private updateZ(z: number) {
    this.z = z;
    this.children.forEach(child => {
      (child as Actor).z = z;
    });
  }

  private updateOpacity(opacity: number) {
    this.graphics.opacity = opacity;
    this.children.forEach(child => {
      (child as Actor).graphics.opacity = opacity / 2;
    });
  }

  onPreUpdate(engine: Engine) {
    const pos = engine.currentScene.input.pointers.primary.lastWorldPos;
    if (!pos) {
      return this.updateOpacity(0);
    }

    const tile = this.board.getTileByWorldPoint(pos);
    if (!tile) {
      return this.updateOpacity(0);
    }

    if (this.parent === tile || !tile.solid) return;
    this.pos = tile.pos.clone();
    this.updateOpacity(1);
    this.updateZ(tile.get(TransformComponent).z + 1);
  }
}
