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
  // Form model for the update form
  userData: any = {
    Username: '',
    Email: '',
    Birthday: '',
    Password: '' // New password (if the user wishes to change it)
  };

  // Field for current password to verify the update
  currentPassword: string = '';

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UpdateUserFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Retrieve the username stored as a plain string in localStorage
    const username = localStorage.getItem('user');
    if (username) {
      this.fetchApiData.getUser(username).subscribe(
        (data: any) => {
          // Prepopulate the form with existing user details.
          this.userData.Username = data.Username;
          this.userData.Email = data.Email;
          // Format Birthday as YYYY-MM-DD if it exists.
          this.userData.Birthday = data.Birthday ? data.Birthday.split('T')[0] : '';
          this.userData.Password = ''; // Leave password blank
        },
        (error) => {
          console.error('Error loading user data:', error);
          this.snackBar.open('Error loading user data. Please try again.', 'OK', { duration: 2000 });
        }
      );
    } else {
      console.error('No user found in localStorage');
      this.snackBar.open('User not found. Please log in again.', 'OK', { duration: 2000 });
    }
  }

  updateUser(): void {
    if (!this.currentPassword) {
      this.snackBar.open('Current password is required.', 'OK', { duration: 2000 });
      return;
    }
  
    // Build the payload. Include the new password only if provided.
    const updatedDetails: any = {
      Username: this.userData.Username,  // New username (if changed)
      Email: this.userData.Email,
      Birthday: this.userData.Birthday,
      Password: this.userData.Password ? this.userData.Password : undefined
    };
  
    // Use the old username stored in localStorage for the URL,
    // so the backend’s permission check passes.
    const oldUsername = localStorage.getItem('user');
    if (!oldUsername) {
      this.snackBar.open('User not found in localStorage.', 'OK', { duration: 2000 });
      return;
    }
  
    this.fetchApiData.updateUserProfile(oldUsername, updatedDetails).subscribe(
      (result: any) => {
        console.log('User update successful:', result);
        // Update localStorage with the new username from the result
        localStorage.setItem('user', result.user.Username);
        this.dialogRef.close();
        this.snackBar.open('Profile updated successfully!', 'OK', { duration: 2000 });
        // Reload the profile page (or navigate to it) to show updated info
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
