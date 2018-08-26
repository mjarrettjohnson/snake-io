import { CollisionDetector, SegmentDetector } from './collision-detector';
import { Position } from '../interfaces/state';

export class Segment {

  constructor(public position: Position, private collisionDetector: CollisionDetector) { }

  hasCollision(headPosition: Position) {
    return this.collisionDetector.hasCollision(this.position, headPosition);
  }

  update(position: Position) {
    this.position = { ...position };
  }
}
