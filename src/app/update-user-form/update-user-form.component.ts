import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-user-form',
  templateUrl: './update-user-form.component.html',
  styleUrls: ['./update-user-form.component.scss'],
})
export class UpdateUserFormComponent implements OnInit {
  userData: any = {
    Username: '',
    Email: '',
    Birthday: '',
    Password: '', // New password (if provided)
  };
  currentPassword: string = '';

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UpdateUserFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Retrieve the username (stored as a simple string in localStorage)
    const username = localStorage.getItem('user');
    if (username) {
      // Fetch full user details from the API
      this.fetchApiData.getUser(username).subscribe(
        (data: any) => {
          // Populate the form with the fetched user data
          this.userData = {
            Username: data.Username,
            Email: data.Email,
            Birthday: data.Birthday ? data.Birthday.split('T')[0] : '', // Format as YYYY-MM-DD if needed
            Password: '', // Leave blank for new password
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

  updateUser(): void {
    // Optionally, you might want to require the current password before updating.
    if (!this.currentPassword) {
      this.snackBar.open('Current password is required.', 'OK', { duration: 2000 });
      return;
    }
    const updatedDetails: any = {
      Username: this.userData.Username,
      Email: this.userData.Email,
      Birthday: this.userData.Birthday,
      // If a new password is provided, include it. Otherwise, you might skip it.
      Password: this.userData.Password ? this.userData.Password : undefined,
    };
    console.log('Updating user with:', updatedDetails);

    const username = localStorage.getItem('user');
    if (!username) {
      this.snackBar.open('User not found in localStorage.', 'OK', { duration: 2000 });
      return;
    }

    this.fetchApiData.updateUserProfile(username, updatedDetails).subscribe(
      (result: any) => {
        console.log('User update success:', result);
        localStorage.setItem('user', result.user.Username);
        this.dialogRef.close();
        this.snackBar.open('User updated successfully!', 'OK', { duration: 2000 });
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
