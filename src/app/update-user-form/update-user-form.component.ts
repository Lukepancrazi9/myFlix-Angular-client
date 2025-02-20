import { Component, OnInit, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-update-user-form',
  templateUrl: './update-user-form.component.html',
  styleUrls: ['./update-user-form.component.scss']
})
export class UpdateUserFormComponent implements OnInit {
  // This object holds the updated user info.
  userData: any = {
    Username: '',
    Email: '',
    Birthday: '',
    Password: ''  // This is used if the user wants to change their password.
  };

  // Field for confirming changes (i.e. the user's current password)
  currentPassword: string = '';
  isBrowser: boolean = false;

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UpdateUserFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Determine if we are running in the browser.
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Only access localStorage if we are in the browser.
    if (this.isBrowser) {
      const username = localStorage.getItem('user');
      if (username) {
        // Fetch the full user data from the API.
        this.fetchApiData.getUser(username).subscribe(
          (data: any) => {
            this.userData = {
              Username: data.Username,
              Email: data.Email,
              // Format the Birthday (assumes ISO string) to YYYY-MM-DD.
              Birthday: data.Birthday ? data.Birthday.split('T')[0] : '',
              Password: '' // Leave blank for new password.
            };
          },
          (error) => {
            console.error('Error fetching user data:', error);
            this.snackBar.open('Error loading user info. Please try again.', 'OK', { duration: 2000 });
          }
        );
      } else {
        console.error('No user found in localStorage');
        this.snackBar.open('User not found. Please log in again.', 'OK', { duration: 2000 });
      }
    }
  }

  updateUser(): void {
    if (!this.currentPassword) {
      this.snackBar.open('Current password is required.', 'OK', { duration: 2000 });
      return;
    }
  
    // Prepare the updated user data. Only include the new password if provided.
    const updatedDetails: any = {
      Username: this.userData.Username,
      Email: this.userData.Email,
      Birthday: this.userData.Birthday,
      Password: this.userData.Password ? this.userData.Password : undefined
    };
  
    // Retrieve the username from localStorage (only in the browser)
    let username = '';
    if (this.isBrowser) {
      username = localStorage.getItem('user') || '';
    }
    if (!username) {
      this.snackBar.open('User not found in localStorage.', 'OK', { duration: 2000 });
      return;
    }
  
    // Call the service to update the user profile.
    this.fetchApiData.updateUserProfile(username, updatedDetails).subscribe(
      (result: any) => {
        console.log('User update success:', result);
        // Optionally update localStorage with the new username if it changed.
        localStorage.setItem('user', result.user.Username);
        this.dialogRef.close();
        this.snackBar.open('User updated successfully!', 'OK', { duration: 2000 });
        // Reload the profile page (this method forces a refresh).
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/profile']);
        });
      },
      (error) => {
        console.error('User update error:', error);
        this.snackBar.open(error.error || 'Update failed. Try again.', 'OK', { duration: 2000 });
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
