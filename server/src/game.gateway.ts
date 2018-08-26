import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { SnakeGame } from 'snake-game';
import { Game } from '../../game/game';
import { CHANGE_DIRECTION, CONNECT, CREATE_GAME, CREATE_PLAYER, DISCONNECT, GET_GAME_INFO, RETRIEVE_GAMES } from '../../interfaces/messages';
import { ChangeDirectionConfig, CreateGameConfig, NameConfig, PersonConfig, SnakeGameState } from '../../interfaces/models';

export interface Games {
  [key: string]: SnakeGame;
}

@WebSocketGateway(2000)
export class GameGateway {
  timeSub: Subscription = Subscription.EMPTY;

  games: Games = {};

  games$ = new BehaviorSubject<Games>({});

  _games: Observable<any>;

  @SubscribeMessage(CREATE_GAME)
  initialize(client, data: CreateGameConfig) {
    const { gameName } = data;

    this.games[gameName] = this.createSnakeGame(data);

    this.emitGames();
  }

  @SubscribeMessage(CREATE_PLAYER)
  createPlayer(client, data: PersonConfig) {
    this.games[data.gameName].addPlayer(data);
    this.emitGames();
  }

  @SubscribeMessage(CONNECT)
  connect(client, config: NameConfig) {
    const { gameName, name } = config;
    return this.games[gameName].connect(name);
  }

  @SubscribeMessage(DISCONNECT)
  disconnect(client, config: NameConfig) {
    const { gameName, name } = config;

    const game = this.games[gameName];

    game.disconnect(name);

    if (game.players.length === 0) {
      game.destroy();
      delete this.games[gameName];
    }

    this.emitGames();
  }

  @SubscribeMessage(CHANGE_DIRECTION)
  onChangeDirection(client, data: ChangeDirectionConfig) {
    this.games[data.gameName].updateDirection(data);
  }

  @SubscribeMessage(RETRIEVE_GAMES)
  retrieveGames(client) {
    if (!this._games) {
      this._games = this.games$.pipe(
        map((games: Games) => {
          const state: SnakeGameState[] = Object.keys(games).map(
            (key: string) => games[key].state,
          );
          return { event: RETRIEVE_GAMES, data: state };
        }),
      );
    }
    return this._games;
  }

  @SubscribeMessage(GET_GAME_INFO)
  getGameInfo(client, gameName: string) {
    const width = this.games[gameName].width;
    const height = this.games[gameName].height;
    return { event: GET_GAME_INFO, data: { width, height } };
  }

  private createSnakeGame(data: CreateGameConfig) {
    const { boardWidth, boardHeight, snakeSize, gameName } = data;

    const game = new Game(
      parseInt(boardWidth, 10),
      parseInt(boardHeight, 10),
      parseInt(snakeSize, 10),
    );

    return new SnakeGame(game, gameName, 50);
  }

  private emitGames() {
    this.games$.next(this.games);
  }
}
