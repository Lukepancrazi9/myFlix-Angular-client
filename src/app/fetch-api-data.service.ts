import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const apiUrl = 'https://crazi-movies-5042ca35c2c0.herokuapp.com/';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getHeaders(): HttpHeaders {
    if (isPlatformBrowser(this.platformId)) {
      // We're in the browser
      const token = localStorage.getItem('token') || '';
      console.log('Authorization Header:', token);
      // Instead of throwing an error, return headers without token if it’s not present.
      if (!token) {
        return new HttpHeaders({
          'Content-Type': 'application/json',
        });
      }
      return new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });
    } else {
      // On the server, localStorage is not available.
      // Return headers without the token.
      return new HttpHeaders({
        'Content-Type': 'application/json',
      });
    }
  }

  // User registration
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: false,  // Disable credentials for this request
    }).pipe(catchError(this.handleError));
  }
  // User login
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }).pipe(catchError(this.handleError));
  }

  // Get logged-in user details
  public getUser(username: string): Observable<any> {
    return this.http.get(apiUrl + `users/${username}`, {
      headers: this.getHeaders(),
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Edit user
  public updateUserProfile(username: string, updatedData: any): Observable<any> {
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }
  
    if (!token) {
      return throwError(() => new Error('Authorization token is missing.'));
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    return this.http.put(`${apiUrl}users/${username}`, updatedData, { headers })
      .pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  // Delete user
  public deleteUser(username: string): Observable<any> {
    return this.http.delete(apiUrl + `users/${username}`, {
      headers: this.getHeaders(),
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get all movies
  public getAllMovies(): Observable<any> {
    return this.http.get(apiUrl + 'movies', { headers: this.getHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get a single movie by title
  public getMovie(title: string): Observable<any> {
    return this.http.get(apiUrl + `movies/${title}`, { headers: this.getHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get director details
  public getDirector(directorName: string): Observable<any> {
    return this.http.get(apiUrl + `movies/directors/${directorName}`, { headers: this.getHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public getAllGenres(): Observable<any> {
    return this.http.get(apiUrl + 'genres', { headers: this.getHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
  

  // Get genre details
  public getGenre(genreName: string): Observable<any> {
    return this.http.get(apiUrl + `movies/genres/${genreName}`, { headers: this.getHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Add a movie to favorite movies
  public addFavMovies(username: string, movieID: string): Observable<any> {
    const body = {
      movieId: movieID, // or any required parameters the backend expects
    };
    return this.http.post(apiUrl + `users/${username}/movies/${movieID}`, body, {
      headers: this.getHeaders(),
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Remove a movie from favorite movies
  public deleteFavMovies(username: string, movieID: string): Observable<any> {
    return this.http.delete(apiUrl + `users/${username}/movies/${movieID}`, {
      headers: this.getHeaders(),
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Extract non-typed response data
  private extractResponseData(res: any): any {
    return res || {};
  }

  // Handle errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(`Error Status: ${error.status}, Message: ${error.error || error.message}`);
    if (error.status === 401) {
      // Handle unauthorized error specifically (e.g., redirect to login)
    }
    return throwError(() => new Error(error.error?.message || 'Something went wrong, please try again later.'));
  }
}
