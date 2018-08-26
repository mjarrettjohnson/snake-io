

export class CreateGameConfig {
  gameName = '';
  snakeSize = '';
  boardWidth = '';
  boardHeight = '';
}

export interface GameDetailsConfig {
  width: number;
  height: number;
}

export interface SnakeGameState {
  players: number;
  name: string;
}

export class PersonConfig {
  name = '';
  color = '';
  gameName = ''
}

export class NameConfig {
  name = '';
  gameName = '';
}

export enum Directions {
  Right = 'Right',
  Left = 'Left',
  Up = 'UP',
  Down = 'Down',
}


export interface ChangeDirectionConfig {
  name: string;
  direction: Directions;
  gameName: string;
}