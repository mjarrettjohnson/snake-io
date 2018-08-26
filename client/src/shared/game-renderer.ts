import { GameState, Position } from '../../../interfaces/state';
export class GameRenderer {

  constructor(private context: CanvasRenderingContext2D, private width: number, private height: number) { }


  render(state: GameState) {
    this.clearBoard();

    this.draw(state.food.position, state.food.color, state.food.size);

    state.snakes.forEach((snake) => {
      snake.segments.forEach(segment => {
        this.draw({ x: segment.x, y: segment.y }, snake.color, snake.size);
      });
    });

  }

  private draw(position: Position, color: string, size: number) {
    this.clear(position, size);
    this.context.fillStyle = color;
    this.context.fillRect(position.x, position.y, size, size);
  }

  private clear(position: Position, size: number) {
    this.context.fillStyle = '#dddddd';
    this.context.fillRect(position.x, position.y, size, size);
  }

  clearBoard() {
    this.context.fillStyle = '#dddddd';
    this.context.fillRect(0, 0, this.width, this.height);
  }
}
