import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { SynopsisComponent } from '../synopsis/synopsis.component';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favorites: string[] = []; // Store favorite movie IDs
  showLeftArrow: boolean = false;
  showRightArrow: boolean = true;

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.getFavorites();
  }

  // Get all movies
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
    });
  }

  // Get favorites from the logged-in user
  getFavorites(): void {
    const username = localStorage.getItem('user'); // Get stored username
    console.log('Retrieved username from localStorage:', username); // Debugging output

    if (username) {
      this.fetchApiData.getUser(username).subscribe((resp: any) => {
        console.log('Fetched favorites from user:', resp); // Debugging output
        this.favorites = resp.FavoriteMovies || []; // Safely access FavoriteMovies
      });
    } else {
      console.error('No username found in localStorage');
    }
  }

  // Open synopsis dialog
  openSynopsisDialog(movie: any): void {
    this.dialog.open(SynopsisComponent, {
      data: { movie },
      width: '600px',
    });
  }

  // Open director dialog
  openDirectorDialog(movie: any): void {
    this.dialog.open(DirectorInfoComponent, {
      data: { movie },
      width: '500px',
    });
  }

  // Add movie to favorites
  addTitleToFavorites(movieID: string): void {
    const username = localStorage.getItem('user');
    if (!username) {
      console.error('No username found in local storage!');
      return;
    }

    console.log(`Adding movie to favorites: ${movieID} for user: ${username}`);

    this.fetchApiData.addFavMovies(username, movieID).subscribe(
      () => {
        this.favorites.push(movieID); // Add movie to local favorites list
        this.snackBar.open('Movie added to favorites', 'Success', { duration: 2000 });
      },
      (error) => {
        console.error('Error adding to favorites:', error);
        this.snackBar.open('Failed to add favorite', 'Error', { duration: 2000 });
      }
    );
  }

  // Remove movie from favorites
  removeTitleFromFavorites(movieID: string): void {
    const username = localStorage.getItem('user');
    if (!username) return;

    this.fetchApiData.deleteFavMovies(username, movieID).subscribe(() => {
      this.favorites = this.favorites.filter(id => id !== movieID); // Remove locally
      this.snackBar.open('Movie removed from favorites', 'Success', { duration: 2000 });
    }, (error) => {
      console.error('Error removing from favorites:', error);
      this.snackBar.open('Failed to remove favorite', 'Error', { duration: 2000 });
    });
  }

  // Check if movie is in favorites
  isFavorite(movieID: string): boolean {
    return this.favorites.includes(movieID);
  }

  // Scroll through movie cards
  scroll(direction: number): void {
    const container = document.querySelector('.movie-grid');
    if (container) {
      const scrollAmount = direction * 300;
      container.scrollLeft += scrollAmount;
      this.updateArrowVisibility(container);
    }
  }

  // Update visibility of scroll arrows
  updateArrowVisibility(container: any): void {
    this.showLeftArrow = container.scrollLeft > 0;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    this.showRightArrow = container.scrollLeft < maxScrollLeft;
  }

  logout(): void {
    localStorage.clear(); // Clear stored user data
    this.router.navigate(['/welcome']); // Redirect to the Welcome Page
  }
}
