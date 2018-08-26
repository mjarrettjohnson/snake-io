import { Body } from './body';
import { Position, SnakeState } from '../interfaces/state';
import { CollisionDetectors, SegmentDetector } from './collision-detector';
import { Segment } from './segment';

export enum PlayerOneKeys {
  Right = 39,
  Left = 37,
  Down = 40,
  Up = 38,
}

export const PLAYER_ONE_GROW = 32;

export enum Directions {
  Right = 'Right',
  Left = 'Left',
  Up = 'UP',
  Down = 'Down',
}

export class MoveCommand {
  constructor(public type: Directions, public position: Position) { }
}

export class Snake {

  private initialPosition;

  public body: Body;


  public score = 0;

  public get state(): SnakeState {
    return {
      size: this.snakeSize,
      color: this.color,
      name: this.name,
      score: this.score,
      segments: this.segmentPositions,
    };
  }

  private currentDirection: Directions = Directions.Left;

  private get segmentPositions(): Position[] {
    return this.body.segments.map(t => t.position);
  }


  constructor(public name: string, private position: Position, private detectors: CollisionDetectors, public color: string, private snakeSize: number) {
    this.initializePosition();
    this.body = new Body(this.position, new SegmentDetector(this.snakeSize));
  }

  update() {
    const newPos = this.getNewPosition();

    if (this.hasCollisionWith(newPos)) {
      return this.reset();
    }

    this.move(newPos);
  }

  hasCollision(): boolean {
    return this.detectors.hasCollision(this.getNewPosition());
  }

  hasCollisionWith(newPosition: Position) {
    return this.body.hasCollision(newPosition);
  }

  setDirection(direction: Directions) {
    if (isValidDirection(this.currentDirection, direction)) {
      this.currentDirection = direction;
    }
  }

  eatFood() {
    this.grow();
    this.score++;
  }

  grow() {
    this.body.add(this.position);
  }

  move(newPosition: Position) {
    this.position = newPosition;
    this.body.move(this.position);
  }

  getPosition() {
    return this.position;
  }

  setPosition(position: Position) {
    this.position = position;
  }

  getNewPosition(): Position {
    return this.calculateNewPosition({ position: this.position, type: this.currentDirection });
  }

  reset() {
    this.score = 0;
    this.body.reset();
    this.position = { ...this.initialPosition };
  }

  private initializePosition() {
    this.movePositionToGrid();
    this.initialPosition = { ...this.position };
  }

  private movePositionToGrid() {
    this.position.x = this.position.x - (this.position.x % this.snakeSize);
    this.position.y = this.position.y - (this.position.y % this.snakeSize);
  }

  private calculateNewPosition(move: MoveCommand): Position {
    const update = { ...move.position } as Position;
    switch (move.type) {
      case Directions.Down:
        update.y = move.position.y + this.snakeSize;
        return update;
      case Directions.Up:
        update.y = move.position.y - this.snakeSize;
        return update;
      case Directions.Left:
        update.x = move.position.x - this.snakeSize;
        return update;
      case Directions.Right:
        update.x = move.position.x + this.snakeSize;
        return update;
      default:
        return update;
    }
  }
}

export function isValidDirection(currentDirection: Directions, direction: Directions): boolean {
  return !isInvalidDirection(currentDirection, direction);
}

function isInvalidDirection(currentDirection: Directions, direction: Directions): boolean {
  return currentDirection === Directions.Left && direction === Directions.Right ||
    currentDirection === Directions.Right && direction === Directions.Left ||
    currentDirection === Directions.Up && direction === Directions.Down ||
    currentDirection === Directions.Down && direction === Directions.Up;
}


