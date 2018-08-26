import { Observable, interval, BehaviorSubject, Subscription } from 'rxjs';
import { GameState } from '../../interfaces/state';
import { Game } from '../../game/game';
import { CONNECT } from '../../interfaces/messages';
import { map, shareReplay } from 'rxjs/operators';
import {
  PersonConfig,
  SnakeGameState,
  ChangeDirectionConfig,
} from '../../interfaces/models';

export interface GameStateEvent {
  event: string;
  data: GameState;
}

export interface Player extends PersonConfig {
  frame$: BehaviorSubject<GameStateEvent>;
}

export class SnakeGame {
  public tick$: Observable<GameStateEvent>;

  private subscriptions: { [key: string]: Subscription } = {};

  public players: Player[] = [];

  public get width() {
    return this.game.width;
  }

  public get height() {
    return this.game.height;
  }

  public get state(): SnakeGameState {
    return {
      name: this.name,
      players: this.players.length,
    };
  }

  constructor(
    private game: Game,
    public name: string,
    private tickRate: number,
  ) {
    this.tick$ = interval(this.tickRate).pipe(
      map(this.update),
      shareReplay(1),
    );
  }

  private checkPlayerSubscription(playerName: string) {
    const sub = this.subscriptions[playerName];
    if (sub) {
      sub.unsubscribe();
    }
  }

  private getPlayer(playerName: string) {
    return this.players.find(t => t.name === playerName);
  }

  public connect(playerName: string): Observable<GameStateEvent> {
    const player = this.getPlayer(playerName);

    this.checkPlayerSubscription(playerName);
    this.addPlayerSubscription(player);

    return player.frame$;
  }

  public addPlayerSubscription(player: Player) {
    this.subscriptions[player.name] = this.tick$.subscribe((event: GameStateEvent) => player.frame$.next(event));
  }

  public addPlayer(config: PersonConfig) {
    const player = {
      ...config,
      frame$: new BehaviorSubject<GameStateEvent>(null),
    };
    this.players.push(player);
    this.game.addSnake(config);
  }

  public destroy() {
    Object.keys(this.subscriptions).forEach(key =>
      this.subscriptions[key].unsubscribe(),
    );
    this.subscriptions = {};
  }

  public updateDirection(data: ChangeDirectionConfig) {
    this.game.updateDirection(data);
  }

  public disconnect(playerName: string) {
    this.removeSubscription(playerName);
    this.updatePlayers(playerName);
    this.game.removeSnake(playerName);
  }

  private updatePlayers(name: string) {
    this.players = this.players.filter(player => player.name !== name);
  }

  private removeSubscription(name: string) {
    const sub = this.subscriptions[name];
    sub.unsubscribe();
    delete this.subscriptions[name];
  }

  private update = () => {
    this.game.updateBoard();
    return { event: CONNECT, data: this.game.state };
  }
}
