import {
  Entity,
  EntityEvents,
  EventEmitter,
  IsometricMap,
  IsometricTile,
  PolygonCollider,
  Scene,
  Shape,
  SpriteSheet,
  vec,
  Vector
} from 'excalibur';
import { AtlasCoords, BoardTile } from './board-tile.entity';
import { indexToPoint, rotateAndFlat, RotationAngleDeg } from '../utils';

export type BoardOptions = {
  tileWidth: number;
  tileHeight: number;
  columns: number;
  rows: number;
  tiles: AtlasCoords[];
  spritesheet: SpriteSheet;
};

export type BoardEvents = {
  rotate: {};
  tileClick: { tile: IsometricTile; event: PointerEvent };
};

export class Board extends Entity {
  private isoMap: IsometricMap;

  private _angle: RotationAngleDeg = 0;

  private _columns: number;

  private _rows: number;

  private tileCollider: PolygonCollider;

  private spritesheet: SpriteSheet;

  public readonly events = new EventEmitter<BoardEvents & EntityEvents>();

  public readonly tiles: BoardTile[];

  constructor(options: BoardOptions) {
    super();
    this.isoMap = new IsometricMap({
      tileWidth: options.tileWidth,
      tileHeight: options.tileHeight,
      columns: Math.max(options.columns, options.rows),
      rows: Math.max(options.columns, options.rows),
      renderFromTopOfGraphic: true
    });
    this.spritesheet = options.spritesheet;
    this._columns = options.columns;
    this._rows = options.rows;
    this.tiles = options.tiles.map(
      tile => new BoardTile({ atlasCoords: tile, board: this })
    );

    this.tileCollider = Shape.Polygon([
      vec(0, this.isoMap.tileHeight / 2),
      vec(this.isoMap.tileWidth / 2, 0),
      vec(this.isoMap.tileWidth, this.isoMap.tileHeight / 2),
      vec(this.isoMap.tileWidth / 2, this.isoMap.tileHeight)
    ]);

    this.isoMap.tiles.forEach(tile => {
      tile.on('pointerup', event => {
        if (!tile.solid) return;
        this.events.emit('tileClick', { tile, event });
      });
    });

    this.updateTiles();
  }

  get tileHeight() {
    return this.isoMap.tileHeight;
  }

  get tileWidth() {
    return this.isoMap.tileWidth;
  }

  get angle() {
    return this._angle;
  }

  get isoTiles() {
    return this.isoMap.tiles;
  }

  /**
   * return ths board columns count when rotation angle is 0
   */
  get baseColumns() {
    return this._columns;
  }

  /**
   * return ths board rows count when rotation angle is 0
   */
  get baseRows() {
    return this._rows;
  }

  /**
   * return ths board columns count, taking current rotation angle into account
   */
  get columns() {
    return this._angle % 180 === 0 ? this._columns : this._rows;
  }

  /**
   * return ths board columns rows, taking current rotation angle into account
   */
  get rows() {
    return this._angle % 180 === 0 ? this._rows : this._columns;
  }

  addToScene(scene: Scene) {
    scene.add(this.isoMap);
  }

  addChild(entity: Entity<any>) {
    this.isoMap.addChild(entity);

    return entity;
  }

  getTileByWorldPoint(vec: Vector) {
    return this.isoMap.getTileByPoint(vec);
  }

  getTileAt(x: number, y: number) {
    return this.isoMap.getTile(x, y);
  }

  private updateTiles() {
    this.isoMap.tiles.forEach(tile => {
      tile.getGraphics().forEach(g => tile.removeGraphic(g));
      tile.removeCollider(this.tileCollider);
      tile.solid = false;
    });

    const rotatedMap = rotateAndFlat(this.tiles, this._angle, this._columns);

    rotatedMap.forEach((boardTile, index) => {
      const point = indexToPoint(index, this.columns);
      const sprite = this.spritesheet.getSprite(
        boardTile.atlasCoords[0],
        boardTile.atlasCoords[1]
      );
      const tile = this.isoMap.getTile(point.x, point.y)!;
      tile.solid = true;
      tile.addGraphic(sprite);
      tile.addCollider(this?.tileCollider);
    });

    this.events.emit('rotate', {});
  }

  tileToWorld(vec: Vector) {
    return this.isoMap.tileToWorld(vec);
  }

  worldtoTile(vec: Vector) {
    return this.isoMap.worldToTile(vec);
  }

  public worldToTileFloat(worldCoordinate: Vector): Vector {
    worldCoordinate = worldCoordinate.sub(this.isoMap.transform.globalPos);

    const halfTileWidth = this.isoMap.tileWidth / 2;
    const halfTileHeight = this.isoMap.tileHeight / 2;
    return vec(
      (worldCoordinate.x / halfTileWidth + worldCoordinate.y / halfTileHeight) / 2,
      (worldCoordinate.y / halfTileHeight - worldCoordinate.x / halfTileWidth) / 2
    );
  }

  rotateCw() {
    this._angle = ((this.angle + 90) % 360) as RotationAngleDeg;
    this.updateTiles();
  }

  rotateCcw() {
    this._angle = ((this.angle - 90) % 360) as RotationAngleDeg;
    this.updateTiles();
  }
}
