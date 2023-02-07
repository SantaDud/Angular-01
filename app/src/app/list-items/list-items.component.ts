import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from '../game';
import { AuthService } from '../services/auth.service';
import { GamesService } from '../services/games.service';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.css'],
})
export class ListItemsComponent implements OnInit {
  // Holds all the items in the database
  games: Game[] = [];
  constructor(
    private gamesService: GamesService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    // Subscribe to the getGames method to get the games
    this.gamesService.getGames().subscribe((games) => {
      this.games = games;
    });
  }

  delete(id: string) {
    // Delete the game from the database
    this.gamesService.deleteGame(id);

    // Unsubscribe from the game service
    this.gamesService
      .getGames()
      .subscribe((games) => {
        this.games = games;
      })
      .unsubscribe();

    // Navigate back to the home page.
    this.router.navigateByUrl('', { skipLocationChange: false }).then(() => {
      this.router.navigate(['']);
    });

    // Call to resubscribe to the service and get updated data
    this.ngOnInit();
  }
}
