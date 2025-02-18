import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const apiUrl = 'https://crazi-movies-5042ca35c2c0.herokuapp.com/';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    });
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
    const token = localStorage.getItem('token');
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
  private handleError(error: HttpErrorResponse): any {
    console.error(`Error Status: ${error.status}, Message: ${error.error || error.message}`);
    return throwError(() => new Error('Something went wrong, please try again later.'));
  }
}
