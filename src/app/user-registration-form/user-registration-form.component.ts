import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar) { }

ngOnInit(): void {
}

// This is the function responsible for sending the form inputs to the backend
registerUser(): void {
  console.log('Register button clicked');
  this.fetchApiData.userRegistration(this.userData).subscribe((result) => {
    console.log('Registration successful', result);
    this.dialogRef.close();
    this.snackBar.open('Registration Successful', 'OK', { duration: 2000 });
  }, (error) => {
    console.error('Registration error', error);
    this.snackBar.open(error.error || 'Registration failed. Please try again.', 'OK', { duration: 2000 });
  });
}

}