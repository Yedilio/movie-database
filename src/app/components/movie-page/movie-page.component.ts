import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { MovieServiceService } from '../../service/movie-service.service';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-movie-page',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    MatProgressBarModule,
  ],
  templateUrl: './movie-page.component.html',
  styleUrls: ['./movie-page.component.scss'],
  providers: [MovieServiceService],
})
export class MoviePageComponent implements OnInit, OnDestroy {
  searchService = inject(MovieServiceService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  loading: boolean = false;
  title = new FormControl('', []);

  filter$ = new BehaviorSubject<any>([]);
  movies$: Observable<any> = this.filter$;
  destroy$ = new Subject();

  ngOnInit(): void {
    this.title.valueChanges
      .pipe(
        tap(() => (this.loading = true)),
        debounceTime(500),
        distinctUntilChanged(),
        filter((termSearch: string | null) => {
          this.router
            .navigate([], {
              queryParams: {
                q: termSearch?.trim() || '',
              },
              queryParamsHandling: 'merge',
            })
            .then();

          if (termSearch) {
            return termSearch.trim().length > 3;
          }
          return true;
        }),
        switchMap((searchTerm: any) =>
          this.searchService.getMoviesByTitle(searchTerm)
        ),
        map((response: any) => response?.results?.slice(0, 10) || []),
        tap(() => (this.loading = false)),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => this.filter$.next(res));

    this.route.queryParamMap
      .pipe(
        distinctUntilChanged(),
        map((res) => res.get('q')),
        tap((res: string | null) => this.title.setValue(res || '')),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
