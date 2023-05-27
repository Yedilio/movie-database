import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, switchMap, tap } from 'rxjs';
import { MovieServiceService } from '../../service/movie-service.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-movie-info',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.scss'],
})
export class MovieInfoComponent {
  route = inject(ActivatedRoute);
  service = inject(MovieServiceService);
  location = inject(Location);
  loading: boolean = true;

  movieInfo$: Observable<any> = this.route.queryParamMap.pipe(
    tap(() => (this.loading = true)),
    map((res) => res.get('imdbId')),
    switchMap((id) => this.service.getMoviesById(id)),
    map((res: any) => res?.results),
    tap(() => (this.loading = false))
  );

  back() {
    this.location.back();
  }
}
