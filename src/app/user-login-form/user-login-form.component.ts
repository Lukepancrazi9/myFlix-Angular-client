import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})

/**
 * This class allows an existing user to log in
 */
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {}

  /**
   * Allows existing user to log in using their logim info and token
   */
  loginUser(): void {
    console.log('Login attempt with:', this.userData);
    this.fetchApiData.userLogin(this.userData).subscribe(
      (response) => {
        console.log('Login successful:', response);
  
        if (isPlatformBrowser(this.platformId)) { // Only store in browser
          localStorage.setItem('user', response.user.Username);
          localStorage.setItem('token', response.token);
        }
  
        this.router.navigate(['movies']);
        this.dialogRef.close();
      },
      (error) => {
        console.error('Login error:', error);
        this.snackBar.open('Incorrect info, please try again', 'Ok', { duration: 2000 });
      }
    );
  }
  
}