import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Country, CountryService } from '../../services/country.service';
import { WeatherData, WeatherService } from '../../services/weather.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-country-detail',
  imports: [DecimalPipe, TitleCasePipe],
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.scss'
})
export class CountryDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private countryService = inject(CountryService);
  // Public so the template can access getWeatherIconUrl directly
  public weatherService = inject(WeatherService);

  country = signal<Country | null>(null);
  weather = signal<WeatherData | null>(null);
  loadingCountry = signal(false);
  loadingWeather = signal(false);
  countryError = signal<string | null>(null);
  weatherError = signal<string | null>(null);

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.loadCountry(name);
    } else {
      this.countryError.set('No country name provided.');
    }
  }

  private loadCountry(name: string): void {
    this.loadingCountry.set(true);
    this.countryError.set(null);

    this.countryService.getCountryByName(name).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          const c = data[0];
          this.country.set(c);
          this.loadingCountry.set(false);
          if (c.capital?.[0]) {
            this.loadWeather(c.capital[0]);
          }
        } else {
          this.countryError.set(`Country "${name}" not found.`);
          this.loadingCountry.set(false);
        }
      },
      error: (err) => {
        this.countryError.set(
          err.status === 404
            ? `Country "${name}" not found.`
            : `Failed to load country data (${err.status}).`
        );
        this.loadingCountry.set(false);
      }
    });
  }

  private loadWeather(city: string): void {
    this.loadingWeather.set(true);
    this.weatherError.set(null);

    this.weatherService.getWeatherByCity(city).subscribe({
      next: (data) => {
        this.weather.set(data);
        this.loadingWeather.set(false);
      },
      error: (err) => {
        this.weatherError.set(
          err.status === 401
            ? 'Invalid API key. Add your OpenWeatherMap key to environment.ts.'
            : err.status === 404
            ? `Weather data not found for "${city}".`
            : `Failed to load weather data (${err.status}).`
        );
        this.loadingWeather.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getCurrencies(country: Country): string {
    if (!country.currencies) return 'N/A';
    return Object.values(country.currencies)
      .map((c) => `${c.name} (${c.symbol})`)
      .join(', ');
  }

  getLanguages(country: Country): string {
    if (!country.languages) return 'N/A';
    return Object.values(country.languages).join(', ');
  }
}
