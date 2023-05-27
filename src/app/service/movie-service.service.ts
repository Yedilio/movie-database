import { inject, Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const headers = new HttpHeaders({
  'X-RapidAPI-Key': '42c030e5e0msh4ffd3e7f9bbf8a1p188c45jsnf5545defd955',
  'X-RapidAPI-Host': 'moviesminidatabase.p.rapidapi.com',
});
@Injectable({
  providedIn: 'root',
})
export class MovieServiceService {
  http = inject(HttpClient);
  API = 'https://moviesminidatabase.p.rapidapi.com/movie/imdb_id/byTitle/';
  APIById = 'https://moviesminidatabase.p.rapidapi.com/movie/id/';

  getMoviesByTitle(searchTerm: string | null) {
    return this.http.get(this.API + searchTerm, { headers }).pipe(
      catchError((error) => {
        console.error('Error getting Movies', error);
        return of([]);
      })
    );
  }

  getMoviesById(id: string | null) {
    return this.http.get(this.APIById + id, { headers }).pipe(
      catchError((error) => {
        console.error('Error getting by id', error);
        return of([]);
      })
    );
  }
}
