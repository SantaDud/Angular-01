import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  angForm: FormGroup;
  constructor(private form: FormBuilder, private authService: AuthService) {
    this.angForm = this.form.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  login(form: FormGroup) {
    // Call the registerUser method to register a new user
    this.authService.registerUser(
      form.value.username,
      form.value.password,
      form.value.confirmPassword
    );
  }

  ngOnInit(): void {}
}
