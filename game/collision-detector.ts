import { Position } from '../interfaces/state';

export const CollisionDetectorFactory = (width: number, height: number, snakeSize: number) => {
  return new CollisionDetectors([
    new LeftWallCollisionDetector(width, height, snakeSize),
    new RightWallCollisionDetector(width, height, snakeSize),
    new TopWallCollisionDetector(width, height, snakeSize),
    new BottomWallCollisionDetector(width, height, snakeSize),
  ]);
};

export interface CollisionDetector {
  hasCollision(position: Position, headPosition?: Position): boolean;
}

export class CollisionDetectors implements CollisionDetector {
  constructor(private detectors: CollisionDetector[]) { }

  hasCollision(position: Position): boolean {
    return this.detectors.some(detector => detector.hasCollision(position));
  }
}

export class SegmentDetector implements CollisionDetector {

  constructor(private segmentSize: number) {

  }

  hasCollision(myPosition: Position, headPosition: Position): boolean {
    return this.isCollision(myPosition.x, headPosition.x) && this.isCollision(myPosition.y, headPosition.y);
  }

  private isCollision(myX: number, headX: number) {
    return headX > (myX - (this.segmentSize / 2)) && headX < (myX + (this.segmentSize / 2));
  }
}

export abstract class WallCollisionDetector {

  protected leftWall = 0;
  protected rightWall = 0;

  protected topWall = 0;
  protected bottomWall = 0;

  abstract hasCollision(position: Position): boolean;

  constructor(width: number, height: number, protected snakeSize: number) {
    this.rightWall = width;
    this.topWall = height;
  }
}

export class LeftWallCollisionDetector extends WallCollisionDetector {

  hasCollision(position: Position): boolean {
    return position.x < this.leftWall;
  }
}

export class RightWallCollisionDetector extends WallCollisionDetector {
  hasCollision(position: Position): boolean {
    return (position.x + this.snakeSize) > this.rightWall;
  }
}

export class TopWallCollisionDetector extends WallCollisionDetector {

  hasCollision(position: Position): boolean {
    return position.y < this.bottomWall;
  }
}

export class BottomWallCollisionDetector extends WallCollisionDetector {
  hasCollision(position: Position): boolean {
    return (position.y + this.snakeSize) > this.topWall;
  }
}
