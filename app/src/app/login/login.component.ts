import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  angForm: FormGroup;
  constructor(
    private form: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.angForm = this.form.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login(form: FormGroup) {
    // Call to the loginUser to login the user
    this.authService.loginUser(form.value.username, form.value.password);
  }
}
