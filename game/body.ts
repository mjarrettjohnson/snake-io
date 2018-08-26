import { Segment } from './segment';
import { Position } from '../interfaces/state';
import { CollisionDetector } from './collision-detector';

export class Body {

  segments: Segment[] = [];

  constructor(private initialPosition: Position, private collisionDetector: CollisionDetector) {
    this.initialize();
  }

  private initialize() {
    this.segments = [];
    this.add(this.initialPosition);
    this.add(this.initialPosition);
  }

  hasCollision(headPosition: Position) {
    return this.segments.some(segment => segment.hasCollision(headPosition));
  }

  move(position: Position) {

    if (this.segments.length === 0) {
      return;
    }

    for (let i = this.segments.length - 1; i > 0; i--) {
      this.segments[i].update(this.segments[i - 1].position);
    }

    this.segments[0].update(position);
  }

  add(position: Position) {

    const lastSegment = this.getLastSegment();

    const segment = !!lastSegment
      ? new Segment({ ...lastSegment.position }, this.collisionDetector)
      : new Segment({ ...position }, this.collisionDetector);

    this.segments.push(segment);
  }
  reset() {
    this.initialize();
  }

  private getLastSegment() {
    return this.segments[this.segments.length - 1];
  }
}
