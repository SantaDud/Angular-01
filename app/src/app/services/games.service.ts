import { Injectable } from '@angular/core';
import { Game } from '../game';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  constructor(private http: HttpClient, public authService: AuthService) {}

  getGames() {
    return this.http.get<Game[]>('http://localhost:3000/dashboard');
  }

  createGame(
    Name: string,
    Release: string,
    TotalRating: number,
    Rating: number
  ) {
    // Send a post request to the server along with the username of the user
    // Creates a new entry in the database with the username
    this.http
      .post<Game>('http://localhost:3000/dashboard', {
        username:
          localStorage.getItem('admin') === 'true'
            ? 'admin'
            : localStorage.getItem('user'),
        Name: Name,
        Release: Release,
        TotalRating: TotalRating,
        Rating: Rating,
      })
      .subscribe((response) => console.log(response));
  }

  editGame(
    id: string,
    Name: string,
    Release: string,
    TotalRating: number,
    Rating: number
  ) {
    // Send a post request to the server along without the username
    // because the username will already be known
    // Instead send the id of the entry in the URI
    this.http
      .post<Game>(`http://localhost:3000/dashboard/${id}`, {
        Name: Name,
        Release: Release,
        TotalRating: TotalRating,
        Rating: Rating,
      })
      .subscribe((response) => console.log(response));
  }

  deleteGame(id: string) {
    // Send a delete request to the server along with the id of the game in the URI
    this.http
      .delete<Game>(`http://localhost:3000/dashboard/${id}`)
      .subscribe((response) => console.log(response));
  }
}
