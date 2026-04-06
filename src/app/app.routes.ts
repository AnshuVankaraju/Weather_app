import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/countries-list/countries-list.component').then(
        (m) => m.CountriesListComponent
      )
  },
  {
    path: 'country/:name',
    loadComponent: () =>
      import('./components/country-detail/country-detail.component').then(
        (m) => m.CountryDetailComponent
      )
  },
  {
    path: '**',
    redirectTo: ''
  }
];
