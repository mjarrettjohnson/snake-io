import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ReactiveComponent, FormModel, FormControl } from '../../shared/reactive-component';
import { PersonConfig, GameDetailsConfig } from '../../../../interfaces/models';
import { FormBuilder } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Debug, StartWith } from 'rxjs-decorators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { tap, switchMap, first, map } from 'rxjs/operators';
import { SocketService } from '../../shared/websocket.service';
import { GET_GAME_INFO, CREATE_PLAYER } from '../../../../interfaces/messages';
import { GameService } from '../../shared/game.service';

export interface GameDetails {
  name: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-create-person',
  templateUrl: './create-person.component.html',
  styleUrls: ['./create-person.component.css']
})
export class CreatePersonComponent extends ReactiveComponent<PersonConfig> implements OnInit, OnDestroy {

  @FormModel
  gameConfig: Observable<PersonConfig>;

  @StartWith('#000000')
  @FormControl
  color: Observable<string>;

  @StartWith('miles')
  @FormControl
  name: Observable<string>;

  private destroyed = new Subject();

  constructor(
    formBuilder: FormBuilder,
    private gameService: GameService,
    private router: Router,
  ) {
    super(formBuilder.group(new PersonConfig()));
    this.gameService.requestGameInfo();


    this.start();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  submit() {
    const model: PersonConfig = this.formModel.value;
    this.gameService.createPlayer(model);
    this.router.navigate(['/play']);
  }

}
