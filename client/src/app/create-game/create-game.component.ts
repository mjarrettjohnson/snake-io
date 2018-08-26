import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CreateGameConfig } from '../../../../interfaces/models';
import { ReactiveModel, Pipe, Transform, Debug, Subscribe, DebounceTime, DistinctUntilChanged, StartWith } from 'rxjs-decorators';
import { Observable, of } from 'rxjs';
import { FormControl, ReactiveComponent, FormModel } from '../../shared/reactive-component';
import { } from 'events';
import { SocketService } from '../../shared/websocket.service';
import { CREATE_GAME } from '../../../../interfaces/messages';
import { Router } from '@angular/router';
import { GameService } from '../../shared/game.service';

const OnlyDigits = Transform((x: string) => x.replace(/[^\d+]/g, ''));

export const NumberControl = Pipe([
  FormControl,
  OnlyDigits
]);

export const Model = Pipe([
  FormModel,
  DistinctUntilChanged(),
  DebounceTime(250),
  Debug()
]);


@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent extends ReactiveComponent<CreateGameComponent> implements OnInit, OnDestroy {

  @Model
  gameConfig: Observable<CreateGameConfig>;

  @StartWith('Game')
  @FormControl
  gameName: EventEmitter<string>;

  @StartWith(10)
  @NumberControl
  snakeSize: Observable<string>;

  @StartWith(400)
  @NumberControl
  boardWidth: Observable<string>;

  @StartWith(400)
  @NumberControl
  boardHeight: Observable<string>;

  constructor(
    formBuilder: FormBuilder,
    private gameService: GameService,
    private router: Router
  ) {
    super(formBuilder.group(new CreateGameConfig()));

    this.start();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // this.dispose();
  }

  submit() {
    const model: CreateGameConfig = this.formModel.value;
    this.gameService.createGame(model);
    this.router.navigate(['/join', model.gameName]);
  }
}
