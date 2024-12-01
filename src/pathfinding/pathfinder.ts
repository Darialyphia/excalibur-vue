import { ExcaliburGraph } from '@excaliburjs/plugin-pathfinding';
import { Board } from '../board/board.entity';
import { BoardTile } from '../board/board-tile.entity';
import { UiState } from '../App-old.vue';
import { watch } from 'vue';

export class Pathfinder {
  private board: Board;

  private uiState: UiState;

  private graph: ExcaliburGraph;

  constructor(board: Board, uiState: UiState) {
    this.board = board;
    this.uiState = uiState;

    this.graph = new ExcaliburGraph();
    this.addNodes();
    this.addEdges();

    watch(this.uiState.selectedUnit, () => {
      this.rebuild();
    });
  }

  private addNodes() {
    this.board.tiles.forEach((tile, index) => {
      this.graph.addNode({ id: index.toString(), value: tile });
    });
  }

  private addEdges() {
    this.board.tiles.forEach((tile, index) => {
      const { x, y } = tile.boardPosition;

      const neighbors = [
        this.board.getTileAt(x - 1, y),
        this.board.getTileAt(x + 1, y),
        this.board.getTileAt(x, y - 1),
        this.board.getTileAt(x, y + 1)
      ];

      neighbors.forEach(tile => {
        if (this.hasEdges(tile)) {
          const otherIndex = this.board.tiles.indexOf(tile);
          this.graph.addEdge({
            name: `${index}_${otherIndex}`,
            from: this.graph.nodes.get(index.toString())!,
            to: this.graph.nodes.get(otherIndex.toString())!,
            value: 1
          });
        }
      });
    });
  }

  getPath(from: BoardTile, to: BoardTile) {
    const path = this.graph.shortestPath(
      this.graph.nodes.get(this.board.tiles.indexOf(from).toString())!,
      this.graph.nodes.get(this.board.tiles.indexOf(to).toString())!
    );

    return path.slice(1).map(node => node.value) as BoardTile[];
  }

  rebuild() {
    this.graph.resetGraph();
    this.addNodes();
    this.addEdges();
  }

  private hasEdges(tile?: BoardTile): tile is BoardTile {
    if (!tile) return false;

    const isOccupied = tile.isOccupied;
    return !isOccupied && tile.isWalkable;
  }
}
