import { BoardPiece, BoardPieceOptions } from '../board/board-piece.actor';
import { UiState } from '../App-old.vue';
import { watchEffect } from 'vue';
import { resources } from '../resources';
import { ISO_TILE_HEIGHT } from '../constants';
import { Engine, vec } from 'excalibur';

export type BoardTileHighlight = Omit<BoardPieceOptions, 'solid'> & {
  uiState: UiState;
};

export class BoardPieceHighlight extends BoardPiece {
  private uiState: UiState;

  constructor(options: BoardTileHighlight) {
    super({ ...options, solid: false });
    this.uiState = options.uiState;
    this.graphics.use(resources.tileHighlights.getAnimation('movement')!, {
      offset: vec(0, ISO_TILE_HEIGHT)
    });
    this.graphics.opacity = 0;
  }

  onInitialize(engine: Engine) {
    super.onInitialize(engine);

    watchEffect(() => {
      this.updateHighlight();
    });
  }

  updateHighlight() {
    if (!this.uiState.selectedUnit.value) {
      gsap.to(this.graphics, { opacity: 0, duration: 0.3, ease: Power2.easeInOut });
      return;
    }

    gsap.to(this.graphics, {
      opacity: this.uiState.selectedUnit.value.canMoveTo(this.boardTile) ? 1 : 0,
      duration: 0.3,
      ease: Power2.easeInOut
    });
  }
}
