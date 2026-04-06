import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Country, CountryService } from '../../services/country.service';

@Component({
  selector: 'app-countries-list',
  imports: [FormsModule],
  templateUrl: './countries-list.component.html',
  styleUrl: './countries-list.component.scss'
})
export class CountriesListComponent implements OnInit {
  private countryService = inject(CountryService);
  private router = inject(Router);

  countries = signal<Country[]>([]);
  searchQuery = signal('');
  loading = signal(false);
  error = signal<string | null>(null);
  selectedRegion = signal('All');

  readonly regions = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  filteredCountries = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const region = this.selectedRegion();

    return this.countries().filter((c) => {
      const matchesRegion = region === 'All' || c.region === region;
      const matchesQuery = !query || c.name.common.toLowerCase().includes(query);
      return matchesRegion && matchesQuery;
    });
  });

  ngOnInit(): void {
    this.loading.set(true);
    this.error.set(null);

    this.countryService.getAllCountries().subscribe({
      next: (data) => {
        const sorted = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        this.countries.set(sorted);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(
          err.status === 0
            ? 'Unable to reach the Countries API. Check your connection.'
            : `Failed to load countries (${err.status}).`
        );
        this.loading.set(false);
      }
    });
  }

  viewDetails(country: Country): void {
    this.router.navigate(['/country', country.name.common]);
  }

  setRegion(region: string): void {
    this.selectedRegion.set(region);
  }

  formatPopulation(pop: number): string {
    if (pop >= 1_000_000_000) return (pop / 1_000_000_000).toFixed(1) + 'B';
    if (pop >= 1_000_000) return (pop / 1_000_000).toFixed(1) + 'M';
    if (pop >= 1_000) return (pop / 1_000).toFixed(0) + 'K';
    return pop.toString();
  }
}
