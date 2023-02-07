import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { GamesService } from '../services/games.service';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.css'],
})
export class CreateItemComponent implements OnInit {
  angForm: FormGroup;
  constructor(
    private form: FormBuilder,
    private router: Router,
    private gameService: GamesService,
    public authService: AuthService
  ) {
    this.angForm = this.form.group({
      Name: ['', Validators.required],
      Release: ['', Validators.required],
      TotalRating: ['', Validators.required],
      Rating: ['', Validators.required],
    });
  }

  // Calls the createGame function which creates an entry.
  createItem(form: FormGroup) {
    this.gameService.createGame(
      form.value.Name,
      form.value.Release,
      form.value.TotalRating,
      form.value.Rating
    );

    // Navigate back to the main page
    this.router.navigateByUrl('', { skipLocationChange: false }).then(() => {
      this.router.navigate(['']);
    });
  }

  ngOnInit(): void {}
}
