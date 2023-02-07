import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GamesService } from '../services/games.service';

@Component({
  selector: 'app-update-item',
  templateUrl: './update-item.component.html',
  styleUrls: ['./update-item.component.css'],
})
export class UpdateItemComponent implements OnInit {
  angForm: FormGroup;
  disabled = true;
  constructor(
    private form: FormBuilder,
    private router: Router,
    private gameService: GamesService,
    private route: ActivatedRoute
  ) {
    // Create a Form Group with the fields filled using the route query parameters.
    // Makes the form filled with the game data already available.
    this.angForm = this.form.group({
      id: [this.route.snapshot.queryParamMap.get('_id'), Validators.required],
      Name: [
        this.route.snapshot.queryParamMap.get('name'),
        Validators.required,
      ],
      Release: [
        this.route.snapshot.queryParamMap.get('release'),
        Validators.required,
      ],
      TotalRating: [
        this.route.snapshot.queryParamMap.get('totalRating'),
        Validators.required,
      ],
      Rating: [
        this.route.snapshot.queryParamMap.get('rating'),
        Validators.required,
      ],
    });
  }

  createItem(form: FormGroup) {
    // Calls to the editGame method will update the entry.

    this.gameService.editGame(
      form.value.id,
      form.value.Name,
      form.value.Release,
      form.value.TotalRating,
      form.value.Rating
    );

    // Navigates back to the main page
    this.router.navigateByUrl('', { skipLocationChange: false }).then(() => {
      this.router.navigate(['']);
    });
  }

  ngOnInit(): void {}
}
