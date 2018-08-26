import { Component } from '@angular/core';
import { CreateGameConfig, PersonConfig, GameDetailsConfig, SnakeGameState } from '../../../interfaces/models';
import { CREATE_GAME, CREATE_PLAYER, DISCONNECT, RETRIEVE_GAMES, GET_GAME_INFO } from '../../../interfaces/messages';

import { SocketService } from '../shared/websocket.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';

  width: number;
  height: number;

  games: SnakeGameState[];

  name: string;
  gameName: string;

  gameCreated = false;
  playerCreated = false;

  isCreatingGame = false;
  isCreatingPlayer = false;
  isViewingGames = false;
  isPlayingGame = false;

  constructor(private io: SocketService) {
  }

  showCreateGame() {
    this.isCreatingGame = true;
    this.isCreatingPlayer = false;
    this.isViewingGames = false;
    this.isPlayingGame = false;
  }

  showCreatePlayer() {
    this.isCreatingPlayer = true;
    this.isCreatingGame = false;
    this.isViewingGames = false;
    this.isPlayingGame = false;
  }

  showAvailableGames() {
    this.isCreatingPlayer = false;
    this.isCreatingGame = false;
    this.isViewingGames = true;
    this.isPlayingGame = false;

    this.io.onEvent(RETRIEVE_GAMES).pipe(first()).subscribe((games: SnakeGameState[]) => {
      this.games = games;
    });
    this.io.send(RETRIEVE_GAMES);


  }

  showCurrentGame() {
    this.isCreatingPlayer = false;
    this.isCreatingGame = false;
    this.isViewingGames = false;
    this.isPlayingGame = true;
  }

  joinGame(name: string) {
    this.gameName = name;
    console.log('SET GAME NAME', this.gameName);
    this.showCreatePlayer();

    this.io.onEvent(GET_GAME_INFO).pipe(first()).subscribe((gameDetails: GameDetailsConfig) => {
      console.log('SETTING', gameDetails);
      this.width = gameDetails.width;
      this.height = gameDetails.height;
    });

    this.io.send(GET_GAME_INFO, this.gameName);
  }
  createGame(config: CreateGameConfig) {
    console.log(config);

    this.width = parseInt(config.boardWidth, 10);
    this.height = parseInt(config.boardHeight, 10);

    this.gameCreated = true;

    this.gameName = config.gameName;

    this.io.send(CREATE_GAME, config);
    this.showCreatePlayer();
  }

  createPerson(config: PersonConfig) {

    this.playerCreated = true;
    this.name = config.name;
    config.gameName = this.gameName;

    this.io.send(CREATE_PLAYER, config);
    this.showCurrentGame();
  }
}
