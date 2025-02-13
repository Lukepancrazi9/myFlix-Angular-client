import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-synopsis',
  templateUrl: './synopsis.component.html',
  styleUrl: './synopsis.component.scss',
})
export class SynopsisComponent {
  movie: any;

  // Use MAT_DIALOG_DATA to inject the data passed from the dialog opening, and then assign it to the movie property.
  constructor(
    public dialogRef: MatDialogRef<SynopsisComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.movie = data.movie;
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
