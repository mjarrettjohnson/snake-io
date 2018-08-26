export interface Position {
  x: number;
  y: number;
}

export class SnakeState {
  size: number;
  color: string;
  name: string;
  score: number;
  segments: Position[];
}

export class FoodState {
  size: number;
  color: string;
  position: Position;
}

export class GameState {

  constructor(public snakes: SnakeState[], public food: FoodState) { }
}
