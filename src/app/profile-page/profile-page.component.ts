import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { UpdateUserFormComponent } from '../update-user-form/update-user-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  user: any = null;
  favoriteMovies: any[] = []; // Add a variable to hold the full movie objects for favorites

  constructor(
    private fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  // Fetch user data on initialization
  loadUserData(): void {
    const username = localStorage.getItem('user');
    if (!username) return;
  
    this.fetchApiData.getUser(username).subscribe(
      (data) => {
        console.log('User data:', data); // Debugging
        this.user = data;
  
        const favoriteMovieIDs = data.Favorites || []; // Correct property name
        console.log('Favorite movie IDs:', favoriteMovieIDs); // Debugging
  
        this.fetchApiData.getAllMovies().subscribe((allMovies) => {
          console.log('All movies:', allMovies); // Debugging
          this.favoriteMovies = allMovies.filter((movie: any) =>
            favoriteMovieIDs.includes(movie._id) // Match IDs correctly
          );
          console.log('Loaded favorite movies:', this.favoriteMovies); // Debugging
        });
      },
      (error) => console.error('Error fetching user:', error)
    );
  }

  openUserUpdateDialog(): void {
    this.dialog.open(UpdateUserFormComponent, {
      width: '280px',
    });
  }
  logout(): void {
    localStorage.clear(); // Clear stored user data
    this.router.navigate(['/welcome']); // Redirect to the Welcome Page
  }

}

