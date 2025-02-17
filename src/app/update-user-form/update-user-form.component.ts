import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService  } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-user-form',
  templateUrl: './update-user-form.component.html',
  styleUrl: './update-user-form.component.scss',
})
export class UpdateUserFormComponent implements OnInit {
  @Input() userData = {
    Username: '',
    Password: '',
    Email: '',
    Birthdate: '',
  };

  constructor(
    public fetchApiData: FetchApiDataService ,
    public dialogRef: MatDialogRef<UpdateUserFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  updateUser(): void {
    console.log('Update button clicked');
    this.fetchApiData.editUser(this.userData.Username, this.userData).subscribe((result) => {
      console.log('user update successful', result);
      localStorage.setItem('user', JSON.stringify(result));
      this.dialogRef.close();
      this.snackBar.open('User Update Successful', 'OK', { duration: 2000 });
    }, (error) => {
      console.error('user update error', error);
      this.snackBar.open(error.error || 'User Update failed. Please try again.', 'OK', { duration: 2000 });
    });
  }
}
