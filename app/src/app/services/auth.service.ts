import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Variable used to find if the user is logged in
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  // Variable used to find if the user is admin.
  private _isAdmin$ = new BehaviorSubject<boolean>(false);
  isAdmin$ = this._isAdmin$.asObservable();

  // Variable used to find if the user is a normal user.
  private _isUser$ = new BehaviorSubject<boolean>(false);
  isUser$ = this._isUser$.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Token is used to find if the user is logged in when the site initially opens.
    const token = localStorage.getItem('token');

    // Admin is used to find if the user is admin when the site initially opens.
    const admin = localStorage.getItem('admin');

    // User is used to find if the user is a normal user when the site initially opens.
    const user = localStorage.getItem('user');

    // Set the value of the variables based on the localStorage values.
    this._isLoggedIn$.next(!!token);
    this._isAdmin$.next(!!admin);
    this._isUser$.next(!!user);
  }

  loginUser(username: string, password: string) {
    // Make a post request to the api
    this.http
      .post('http://localhost:3000/signin', {
        username: username,
        password: password,
      })
      .subscribe((data) => {
        //If the response code is 200 then log in the user and set the variable to true
        if (Object(data)['status'] === 200) {
          this._isLoggedIn$.next(true);

          // If the username used to login was admin then set the variable to true
          if (Object(data)['username'] === 'admin') {
            this._isAdmin$.next(true);
            localStorage.setItem('admin', 'true');
          } else {
            // else set the user variable to true
            this._isUser$.next(true);
            localStorage.setItem('user', Object(data)['username']);
          }

          // Set the token variable to mark that the user has logged in
          localStorage.setItem(
            'token',
            `username:${Object(data)['username']}password:${
              Object(data)['password']
            }`
          );

          // Navigate back to main page
          this.router
            .navigateByUrl('', { skipLocationChange: false })
            .then(() => {
              this.router.navigate(['']);
            });
        } else {
          // If login failed then redirect to the login page
          this.router
            .navigateByUrl('/login', { skipLocationChange: false })
            .then(() => {
              this.router.navigate(['/login']);
            });
        }
      });
  }

  registerUser(username: string, password: string, confirmPassword: string) {
    // Make a post request to the api
    this.http
      .post('http://localhost:3000/signup', {
        username: username,
        password: password,
        confirmPassword: confirmPassword,
      })
      .subscribe((data) => {
        //If the response code is 200 then log in the user and set the variable to true
        if (Object(data)['status'] === 200) {
          this._isLoggedIn$.next(true);
          // Since new user cannot be admin so set user variable to true
          this._isUser$.next(true);
          localStorage.setItem('user', Object(data)['username']);

          // Set the value of the token to mark the user is logged in
          localStorage.setItem(
            'token',
            `username:${Object(data)['username']}password:${
              Object(data)['password']
            }`
          );

          // Navigate to the main page
          this.router
            .navigateByUrl('', { skipLocationChange: false })
            .then(() => {
              this.router.navigate(['']);
            });
        } else {
          // If registering failed then navigate to registration page again.
          this.router
            .navigateByUrl('/signup', { skipLocationChange: false })
            .then(() => {
              this.router.navigate(['/signup']);
            });

          alert('User Exists.');
        }
      });
  }

  logoutUser() {
    // Set all the variables to false and remove the items set in the localStorage.
    if (localStorage.getItem('token')) {
      this._isLoggedIn$.next(false);

      this._isAdmin$.next(false);
      localStorage.removeItem('admin');
      this._isUser$.next(false);
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      // Navigate to the login page
      this.router
        .navigateByUrl('/login', { skipLocationChange: false })
        .then(() => {
          this.router.navigate(['/login']);
        });
    }
  }
}
