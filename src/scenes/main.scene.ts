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

const state = {
  footman: {
    x: 0,
    y: 0
  }
};

export class MainScene extends Scene {
  private board!: Board;

  private footman = new Actor();

  private hoveredCell = new Actor({
    y: ISO_TILE_HEIGHT / 2
  });

  override onInitialize(): void {
    this.setupBoard();
    this.setupCamera();
    this.setupInputs();

    this.hoveredCell.graphics.use(resources.hoveredCell.getAnimation('idle')!);
    this.footman.graphics.use(resources.footman.getAnimation('idle')!);
    this.board.addChild(this.footman);
  }

  updateHoveredCell() {
    const pos = this.input.pointers.primary.lastWorldPos;
    if (!pos) {
      this.hoveredCell.unparent();
      return;
    }

    const tile = this.board.getTileByWorldPoint(pos);
    if (!tile) {
      this.hoveredCell.unparent();
      return;
    }

    if (this.hoveredCell.parent === tile || !tile.solid) return;
    this.hoveredCell.unparent();
    tile.addChild(this.hoveredCell);
    this.hoveredCell.z = tile.get(TransformComponent).z;
  }

  onPreUpdate() {
    const pos = this.input.pointers.primary.lastWorldPos;
    if (!pos) {
      this.hoveredCell.unparent();
      return;
    }

    const tile = this.board.getTileByWorldPoint(pos);
    if (!tile) {
      this.hoveredCell.unparent();
      return;
    }

    if (this.hoveredCell.parent === tile || !tile.solid) return;
    this.hoveredCell.unparent();
    tile.addChild(this.hoveredCell);
    this.hoveredCell.z = tile.get(TransformComponent).z;
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
    this.board.events.on('rotate', () => {
      this.centerCamera();
      this.moveFootman(0);
      this.footman.graphics.flipHorizontal =
        this.board.angle === 90 || this.board.angle === 180;
    });
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

    state.footman = rotatedPoint;
    this.moveFootman(0.5);
  }

  moveFootman(duration: number) {
    const rotatedPoint = indexToPoint(
      getRotatedIndex(MAP, pointToIndex(state.footman, MAP_COLS), {
        angle: this.board.angle,
        width: MAP_COLS
      }),
      this.board.columns
    );

    const worldPos = this.board.tileToWorld(vec(rotatedPoint.x, rotatedPoint.y));
    gsap.to(this.footman.pos, {
      x: worldPos.x,
      y: worldPos.y,
      duration,
      ease: Power2.easeInOut,
      onUpdate: () => {
        const tileCoords = this.board.worldToTileFloat(this.footman.pos);
        const tile = this.board.getTileAt(
          Math.ceil(tileCoords.x),
          Math.ceil(tileCoords.y)
        )!;
        this.footman.z = tile.get(TransformComponent).z + 1;
      }
    });
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
  }
}
