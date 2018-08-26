import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../shared/websocket.service';
import { RETRIEVE_GAMES } from '../../../../interfaces/messages';
import { first } from 'rxjs/operators';
import { SnakeGameState } from '../../../../interfaces/models';
import { Observable } from 'rxjs';
import { GameService } from '../../shared/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-games',
  templateUrl: './view-games.component.html',
  styleUrls: ['./view-games.component.css']
})
export class ViewGamesComponent implements OnInit {

  constructor(private gameService: GameService, private router: Router) { }

  games$: Observable<SnakeGameState[]>;

  ngOnInit() {
    this.games$ = this.gameService.availableGames$;
    this.gameService.retrieveGames();
  }

  joinGame(game: SnakeGameState) {
    this.gameService.selectedGame = game.name;
    this.router.navigate(['/join', game.name]);
  }

}
