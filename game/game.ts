import { Food } from './food';
import { Snake, PlayerOneKeys, Directions } from './snake';
import { CollisionDetectorFactory } from './collision-detector';
import { Segment } from './segment';
import { SnakeState, FoodState, GameState, Position } from '../interfaces/state';
import { PersonConfig, ChangeDirectionConfig } from '../interfaces/models';


export class Game {

  private food: Food;

  private snakes: Snake[] = [];

  public scores: number[] = [];

  get state(): GameState {
    return new GameState(
      this.snakes.map(snake => snake.state),
      this.food.state,
    );
  }

  constructor(public width: number, public height: number, private snakeSize: number) {
    this.food = new Food(this.width, this.height, this.snakeSize);
    this.food.generatePosition(this.snakes);
  }

  public addSnake(person: PersonConfig) {
    const snake = new Snake(
      person.name,
      this.initializePosition(),
      CollisionDetectorFactory(this.width, this.height, this.snakeSize),
      person.color,
      this.snakeSize
    );
    this.snakes.push(snake);
  }

  public clear() {
    this.snakes = [];
  }

  public removeSnake(name: string) {
    console.log('Before', this.snakes.length);
    this.snakes = this.snakes.filter(t => t.name !== name);
    this.updateSnakes();
    console.log('after', this.snakes.length);
  }

  public updateBoard() {
    this.resetInvalidSnakes();
    this.growSnakesThatAteFood();
    this.updateSnakes();
    this.updateWallSnakes();
    this.updateScores();
  }

  public updateDirection(data: ChangeDirectionConfig) {
    const snake = this.snakes.find(t => t.name === data.name);
    if (!snake) {
      return;
    }
    switch (data.direction) {
      case Directions.Left:
        snake.setDirection(Directions.Left);
        break;
      case Directions.Right:
        snake.setDirection(Directions.Right);
        break;
      case Directions.Up:
        snake.setDirection(Directions.Up);
        break;
      case Directions.Down:
        snake.setDirection(Directions.Down);
        break;
    }

  }

  private initializePosition(): Position {
    return {
      x: Math.floor((this.width * (this.snakes.length + 1) / (this.snakeSize + 1))),
      y: Math.floor((this.height * (this.snakes.length + 1) / (this.snakeSize + 1))),
    };
  }

  private updateSnakes() {
    this.snakes.forEach(snake => snake.update());
  }

  private updateScores() {
    this.scores = this.snakes.map(snake => snake.score);
  }

  private resetInvalidSnakes() {
    this.getSnakesToReset().forEach(snake => snake.reset());
  }

  private updateWallSnakes() {

    this.snakes = this.snakes.map(snake => {
      if (!snake.hasCollision()) {
        return snake;
      }

      const pos = snake.getPosition();

      if (pos.x < 1) {
        snake.setPosition({ ...pos, x: this.width - this.snakeSize });
        return snake;
      }

      if ((pos.x + this.snakeSize) >= this.width) {
        snake.setPosition({ ...pos, x: 0 - this.snakeSize });

        return snake;
      }

      if (pos.y < 1) {
        snake.setPosition({ ...pos, y: this.height - this.snakeSize });
        return snake;
      }

      if ((pos.y + this.snakeSize) >= this.height) {
        snake.setPosition({ ...pos, y: 0 - this.snakeSize });
        return snake;
      }
      return snake;
    });
  }

  private getSnakesToReset(): Snake[] {
    // const collidedWithWalls = this.snakes.filter(snake => snake.hasCollision());
    const collidedWithAnotherSnake = this.snakes
      .filter(current => this.snakes.some(snake => snake.hasCollisionWith(current.getNewPosition())));

    return [...collidedWithAnotherSnake];
  }

  private growSnakesThatAteFood() {
    this.snakes
      .filter(snake => snake.hasCollisionWith(this.food.position))
      .forEach(snake => {
        snake.eatFood();
        this.food.generatePosition(this.snakes);
      });
  }
}
