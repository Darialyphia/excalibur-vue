import { BoardPiece, BoardPieceOptions } from '../board/board-piece.actor';
import { UiState } from '../App.vue';
import { Ref, watchEffect } from 'vue';
import { movementSheet } from '../resources';
import { ISO_TILE_HEIGHT } from '../constants';
import { Engine, vec } from 'excalibur';

export type BoardTileHighlight = Omit<BoardPieceOptions, 'solid'> & {
  uiState: Ref<UiState>;
};

export class BoardPieceHighlight extends BoardPiece {
  private uiState: Ref<UiState>;

  constructor(options: BoardTileHighlight) {
    super({ ...options, solid: false });
    this.uiState = options.uiState;
    this.graphics.use(movementSheet.getSprite(0, 0), {
      offset: vec(0, ISO_TILE_HEIGHT)
    });
    this.graphics.opacity = 0;
  }

  onInitialize(engine: Engine) {
    super.onInitialize(engine);

    watchEffect(() => {
      if (!this.uiState.value.selectedUnit) {
        gsap.to(this.graphics, { opacity: 0, duration: 0.3, ease: Power2.easeInOut });
        return;
      }

      gsap.to(this.graphics, {
        opacity: this.uiState.value.selectedUnit.canMoveTo(this.boardTile) ? 1 : 0,
        duration: 0.3,
        ease: Power2.easeInOut
      });
    });
  }
}
