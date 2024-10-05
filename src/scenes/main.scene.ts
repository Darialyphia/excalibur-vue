import { Actor, IsometricTile, Scene, TransformComponent, vec, Vector } from 'excalibur';
import { ISO_TILE_HEIGHT, ISO_TILE_WIDTH, MAP, MAP_COLS, MAP_ROWS } from '../constants';
import { mapSheet, resources } from '../resources';
import {
  getRotatedIndex,
  indexToPoint,
  pointToIndex,
  rotateAndFlat,
  RotationAngleDeg
} from '../utils';
import { Board } from '../board/board.entity';
import { HoveredCellActor } from '../ui/actors/hovered-cell.actor';
import { Unit } from '../unit/unit.actor';

export class MainScene extends Scene {
  private board!: Board;

  private footman!: Unit;

  override onInitialize(): void {
    this.setupBoard();
    this.setupUi();
    this.setupCamera();
    this.setupInputs();
    this.setupUnit();
  }

  private setupUnit() {
    this.footman = new Unit({
      board: this.board,
      boardPosition: vec(0, 0),
      resource: resources.footman
    });

    this.board.addChild(this.footman);
  }

  private setupUi() {
    this.add(new HoveredCellActor(this.board));
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
      spritesheet: mapSheet
    });

    this.board.addToScene(this);

    this.board.events.on('tileClick', this.onTileClick.bind(this));
  }

  onTileClick({ tile }: { tile: IsometricTile }) {
    if (!tile.solid) return;
    const index = pointToIndex(tile, this.board.columns);
    const rotatedIndex = getRotatedIndex(
      rotateAndFlat(MAP, this.board.angle, MAP_COLS),
      index,
      {
        angle: (360 - this.board.angle) as RotationAngleDeg,
        width: this.board.columns
      }
    );
    const rotatedPoint = indexToPoint(rotatedIndex, MAP_COLS);
    this.footman.setBoardPosition(vec(rotatedPoint.x, rotatedPoint.y), 0.5);
  }

  centerCamera() {
    const center = this.board.tileToWorld(
      this.board.angle % 180 === 0
        ? new Vector(MAP_COLS / 2, MAP_ROWS / 2)
        : new Vector(MAP_ROWS / 2, MAP_COLS / 2)
    );
    this.camera.move(center, 0);
  }

  private setupCamera() {
    this.camera.zoom = 2;
    this.centerCamera();

    this.board.events.on('rotate', this.centerCamera.bind(this));
  }
}
