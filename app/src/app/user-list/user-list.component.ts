import { Component, OnInit } from '@angular/core';
import { Game } from '../game';
import { AuthService } from '../services/auth.service';
import { GamesService } from '../services/games.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  // games holds all the entries in the database
  games: Game[] = [];

  // userGames holds all the entries in the database created by the user
  userGames: Game[] = [];

  // Define the gamesService and Auth service in the constructor
  constructor(
    private gamesService: GamesService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    // Call the getGames method which return an Observable.
    // Subscribe to the Observable to get the games in the database
    this.gamesService.getGames().subscribe((games) => {
      // Set the local array equal to the data received.
      this.games = games;

      // Find the entries created by the user and push them to the userGames array.
      games.forEach((game) => {
        if (game.User === localStorage.getItem('user'))
          this.userGames.push(game);
      });
    });
  }

  delete(id: string) {
    // Delete the game from the database
    this.gamesService.deleteGame(id);

    // Unsubbscribe from the game service
    this.gamesService
      .getGames()
      .subscribe((games) => {
        this.games = games;
      })
      .unsubscribe();

    // Call to resubscribe to the service and get updated data
    this.ngOnInit();
  }
}
