import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { CreateGameComponent } from './create-game/create-game.component';
import { CreatePersonComponent } from './create-person/create-person.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { GameComponent } from './game/game.component';
import { RouterModule, Routes } from '@angular/router';
import { ViewGamesComponent } from './view-games/view-games.component';

const routes: Routes = [
  {
    path: 'view/games',
    component: ViewGamesComponent
  },
  {
    path: 'create/game',
    component: CreateGameComponent
  },
  { path: '', redirectTo: '/view/games', pathMatch: 'full' },
  {
    path: 'join/:game',
    component: CreatePersonComponent
  },
  {
    path: 'play',
    component: GameComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    CreateGameComponent,
    CreatePersonComponent,
    ColorPickerComponent,
    GameComponent,
    ViewGamesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule,
    RouterModule.forRoot(
      routes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
