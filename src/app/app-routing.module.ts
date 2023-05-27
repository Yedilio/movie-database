import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoviePageComponent } from './components/movie-page/movie-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'movie-search',
  },
  {
    path: 'movie-search',
    component: MoviePageComponent,
  },
  {
    path: 'movie-info',
    loadComponent: () =>
      import('./components/movie-info/movie-info.component').then(
        (com) => com.MovieInfoComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
