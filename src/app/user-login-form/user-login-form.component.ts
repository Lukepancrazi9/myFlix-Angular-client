import { Component, OnInit, Input } from '@angular/core';
//closes dialog on success
import { MatDialogRef } from '@angular/material/dialog';
//fetches api calls from api data file
import { FetchApiDataService } from '../fetch-api-data.service';
//displays notifications to user
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { username: '', password: '' };
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {}
  //function that sends form input to backend
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        //setting login info to localstorage
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.dialogRef.close();
        console.log(result);
        this.snackBar.open(result, 'Ok', {
          duration: 2000,
        });
      },
      (result) => {
        console.log(result);
        this.snackBar.open(result, 'Ok', {
          duration: 2000,
        });
      }
    );
  }
}
