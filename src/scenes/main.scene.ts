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
import { BoardTile } from '../board/board-tile.entity';

export class MainScene extends Scene {
  private board!: Board;

  private units: Unit[] = [];

  override onInitialize(): void {
    this.setupBoard();
    this.setupUi();
    this.setupCamera();
    this.setupInputs();
  }

  addUnit(x: number, y: number) {
    console.log(resources.footman, resources.footman.getSpriteSheet());
    const unit = new Unit({
      board: this.board,
      boardPosition: vec(x, y),
      resource: resources.footman
    });
    this.units.push(unit);
    this.board.addChild(unit);
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

  onTileClick({ boardTile }: { boardTile: BoardTile }) {
    this.addUnit(boardTile.isoTile.x, boardTile.isoTile.y);
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
