import { Scene, SceneActivationContext, vec, Vector } from 'excalibur';
import { ISO_TILE_HEIGHT, ISO_TILE_WIDTH, MAP, MAP_COLS, MAP_ROWS } from '../constants';
import { boardSheet } from '../resources';
import { Board } from '../board/board.entity';
import { HoveredCell } from '../ui/actors/hovered-cell.actor';
import { Unit } from '../unit/unit.actor';
import { BoardTile } from '../board/board-tile.entity';
import { UiState } from '../App-old.vue';
import { BoardPieceHighlight } from '../board/board-tile-highlight';
import { Pathfinder } from '../pathfinding/pathfinder';

export class MainScene extends Scene {
  private board!: Board;

  private uiState!: UiState;

  private pathFinder!: Pathfinder;

  override onActivate(context: SceneActivationContext<UiState>): void {
    this.uiState = context.data!;
    this.setupBoard();
    this.setupUi();
    this.setupCamera();
    this.setupInputs();
    this.pathFinder = new Pathfinder(this.board, this.uiState);
  }

  private addUnit(boardTile: BoardTile) {
    if (!this.uiState.selectedUnitData.value) return;

    const unit = new Unit({
      board: this.board,
      boardPosition: vec(boardTile.boardPosition.x, boardTile.boardPosition.y),
      unitData: this.uiState.selectedUnitData.value,
      uiState: this.uiState,
      pathfinder: this.pathFinder
    });

    this.board.addBoardPiece(unit, boardTile);
    this.uiState.selectUnit(unit);
  }

  private setupUi() {
    this.add(new HoveredCell(this.board, this.uiState));
  }

  private setupInputs() {
    this.input.keyboard.on('press', e => {
      if (e.key === 'KeyQ') {
        this.board.rotateCcw();
      } else if (e.key === 'KeyE') {
        this.board.rotateCw();
      }
    });
  }

  private setupBoard() {
    this.board = new Board({
      columns: MAP_COLS,
      rows: MAP_ROWS,
      tileHeight: ISO_TILE_HEIGHT,
      tileWidth: ISO_TILE_WIDTH,
      tiles: MAP,
      spritesheet: boardSheet
    });

    this.board.tiles.forEach(tile => {
      this.board.addBoardPiece(
        new BoardPieceHighlight({
          board: this.board,
          boardPosition: tile.boardPosition,
          uiState: this.uiState
        }),
        tile
      );
    });
    this.board.addToScene(this);

    this.board.events.on('tileClick', ({ boardTile }) => {
      const unit = boardTile.boardPieces.find(piece => piece instanceof Unit);
      if (unit) {
        this.uiState.selectUnit(unit);
        return;
      }

      if (!this.uiState.selectedUnit.value) {
        return this.addUnit(boardTile);
      }

      if (this.uiState.selectedUnit.value.canMoveTo(boardTile)) {
        this.uiState.selectedUnit.value.moveTo(boardTile);
      }

      this.uiState.selectUnit(null);
    });
  }

  private centerCamera() {
    const center = this.board.tileToWorld(
      this.board.angle % 180 === 0
        ? new Vector(MAP_COLS / 2, MAP_ROWS / 2)
        : new Vector(MAP_ROWS / 2, MAP_COLS / 2)
    );
    this.camera.move(center, 0);
  }

  private setupCamera() {
    this.camera.zoom = 3;
    this.centerCamera();

    this.board.events.on('rotate', this.centerCamera.bind(this));
  }
}
