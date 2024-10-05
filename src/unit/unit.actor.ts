import { AsepriteResource } from '@excaliburjs/plugin-aseprite';
import { BoardPieceActor, BoardPieceOptions } from '../board/board-piece.actor';

export type UnitOptions = BoardPieceOptions & {
  resource: AsepriteResource;
};

export class Unit extends BoardPieceActor {
  constructor(options: UnitOptions) {
    super(options);
    this.graphics.use(options.resource.getAnimation('idle')!);
  }
}
