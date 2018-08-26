import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { GameRenderer } from '../../shared/game-renderer';
import { CONNECT, CHANGE_DIRECTION, DISCONNECT } from '../../../../interfaces/messages';
import { SocketService } from '../../shared/websocket.service';
import { Subject, Observable, ConnectableObservable, Subscription } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { Directions, ChangeDirectionConfig } from '../../../../interfaces/models';
import { GameState, SnakeState } from '../../../../interfaces/state';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GameDetails } from '../create-person/create-person.component';
import { GameService } from '../../shared/game.service';
import { ReactiveComponent } from '../../shared/reactive-component';
import { ReactiveModel, Subscribe, First, Call, Transform, Debug } from 'rxjs-decorators';

export enum PlayerOneKeys {
  Right = 39,
  Left = 37,
  Down = 40,
  Up = 38,
}


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent extends ReactiveModel implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('game') canvasRef: ElementRef;
  context: CanvasRenderingContext2D;

  width: number;

  height: number;

  gameName: string;

  public gameInfo$: Observable<GameDetails>;

  public gameData$: Observable<GameState>;

  public scores$: Observable<{ name: string, score: number }[]>;

  private gameRenderer: GameRenderer;

  private destroyed = new Subject();

  constructor(private route: ActivatedRoute, private gameService: GameService) {
    super();

    this.gameInfo$ = this.gameService.gameInfo$;
    this.gameData$ = this.gameService.currentGameData$;
    this.scores$ = this.gameService.scores$;
    this.initialize();

  }

  @Subscribe(['gameInfo$'])
  setGameInfo(details: GameDetails) {
    console.log('setting details', details);
    this.gameName = details.name;
    this.width = details.width;
    this.height = details.height;
    this.gameService.connect({ gameName: this.gameName, name: this.gameService.playerName });
  }

  @HostListener('window:keyup', ['$event'])
  handleKey(event: KeyboardEvent) {
    const data: ChangeDirectionConfig = {
      name: this.gameService.playerName,
      gameName: this.gameService.selectedGame,
      direction: Directions.Left,
    };
    switch (event.keyCode) {
      case PlayerOneKeys.Left:
        data.direction = Directions.Left;
        break;
      case PlayerOneKeys.Right:
        data.direction = Directions.Right;
        break;
      case PlayerOneKeys.Down:
        data.direction = Directions.Down;
        break;
      case PlayerOneKeys.Up:
        data.direction = Directions.Up;
        break;
    }

    if (data) {
      this.gameService.changeDirection(data);
    }
  }

  ngOnInit() {

  }

  @Subscribe(['gameData$'])
  update(state: GameState) {
    if (!this.context) {
      console.log('CALLING BEFORE CONTEXT');
      return;
    }
    this.gameRenderer.render(state);
  }

  ngAfterViewInit() {
    this.context = (<HTMLCanvasElement>this.canvasRef.nativeElement).getContext('2d');

    this.gameRenderer = new GameRenderer(this.context, this.width, this.height);
  }

  ngOnDestroy() {
    this.gameService.disconnect({ name: this.gameService.playerName, gameName: this.gameService.selectedGame });
    this.destroy();
    this.destroyed.next();
    this.destroyed.complete();
  }
}
