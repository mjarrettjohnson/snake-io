import { Position, FoodState } from '../interfaces/state';
import { Snake } from './snake';

export class Food {

  public position: Position;

  public color: string;

  public size: number;

  public get state(): FoodState {
    return {
      color: this.color,
      position: this.position,
      size: this.size,
    };
  }


  constructor(private width: number, private height: number, private snakeSize: number) {
    this.color = '#592159';
    this.size = 10;
  }

  generatePosition(snakes: Snake[]) {
    let hasCollision = true;
    let x;
    let y;
    while (hasCollision) {
      x = Math.floor(Math.random() * (this.width + 1));
      y = Math.floor(Math.random() * (this.height + 1));

      x = x - (x % this.snakeSize);
      y = y - (y % this.snakeSize);

      hasCollision = snakes.some(snake => snake.hasCollisionWith({ x, y }));
    }

    this.position = { x, y } as Position;
  }
}
