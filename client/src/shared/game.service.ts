
import { Injectable } from '@angular/core';
import { GameDetails } from '../app/create-person/create-person.component';
import {
  CreateGameConfig,
  GameDetailsConfig,
  SnakeGameState,
  NameConfig,
  ChangeDirectionConfig,
  PersonConfig
} from '../../../interfaces/models';
import { SocketService } from './websocket.service';
import {
  CREATE_GAME,
  GET_GAME_INFO,
  RETRIEVE_GAMES,
  DISCONNECT,
  CONNECT,
  CHANGE_DIRECTION,
  CREATE_PLAYER
} from '../../../interfaces/messages';
import { Observable, BehaviorSubject, ConnectableObservable } from 'rxjs';
import {
  Share,
  ReactiveModel,
  ShareReplay,
  Subscribe,
  Transform,
  Exists,
  CombineLatest,
  Debug,
  Next,
  Behaviour,
  MonoOperatorMetadata,
  Pipe
} from 'rxjs-decorators';
import { GameState } from '../../../interfaces/state';
import { publish } from 'rxjs/operators';
import { createPropertyDecorator } from 'rxjs-decorators/lib/src/decorators/creation';



const Height = Pipe([
  Transform((config: GameDetailsConfig) => config.height),
  ShareReplay(1)
]);

const Width = Pipe([
  Transform((config: GameDetailsConfig) => config.width),
  ShareReplay(1)
]);

const Scores = Transform((game: GameState) => game.snakes.map((snake) => ({ name: snake.name, score: snake.score })));

const GameDetails = Transform(([name, width, height]: [string, number, number]) => ({ name, width, height }));

const CollectGameDetails = (...args: string[]) => Pipe([
  CombineLatest(...args),
  GameDetails,
  Debug(),
  Share()
]);


@Injectable({ providedIn: 'root' })
export class GameService extends ReactiveModel {

  public get selectedGame(): string {
    return this.selectedGame$.getValue();
  }

  public set selectedGame(name: string) {
    this.selectedGame$.next(name);
  }

  private selectedGame$ = new BehaviorSubject<string>('');

  public playerName: string;

  @Height
  public height$: Observable<number>;

  @Width
  public width$: Observable<number>;

  @CollectGameDetails('selectedGame$', 'width$', 'height$')
  public gameInfo$: Observable<GameDetails>;

  @ShareReplay(1)
  public availableGames$: Observable<SnakeGameState[]>;

  @ShareReplay(1)
  public currentGameData$: Observable<GameState>;


  @Scores
  public scores$: Observable<any>;

  constructor(private io: SocketService) {
    super();
    this.init();
  }

  dispose() {
    this.destroy();
  }

  init() {
    this.width$ = this.io.onEvent(GET_GAME_INFO);
    this.height$ = this.io.onEvent(GET_GAME_INFO);
    this.availableGames$ = this.io.onEvent(RETRIEVE_GAMES);
    this.currentGameData$ = this.io.onEvent(CONNECT);
    this.scores$ = this.currentGameData$;

    this.initialize();
  }


  createGame(config: CreateGameConfig) {
    this.selectedGame = config.gameName;
    this.io.send(CREATE_GAME, config);
  }

  createPlayer(config: PersonConfig) {
    config.gameName = this.selectedGame;
    this.playerName = config.name;
    this.io.send(CREATE_PLAYER, config);
  }

  changeDirection(config: ChangeDirectionConfig) {
    this.io.send(CHANGE_DIRECTION, config);
  }

  connect(config: NameConfig) {
    this.io.send(CONNECT, config);
  }

  disconnect(config: NameConfig) {
    this.io.send(DISCONNECT, config);
  }

  retrieveGames() {
    this.io.send(RETRIEVE_GAMES);
  }

  requestGameInfo() {
    this.io.send(GET_GAME_INFO, this.selectedGame);
  }
}
