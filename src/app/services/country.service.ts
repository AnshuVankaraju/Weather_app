import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Country {
  name: { common: string; official: string };
  flags: { png: string; svg: string; alt?: string };
  region: string;
  capital?: string[];
  population: number;
  currencies: { [key: string]: { name: string; symbol: string } };
  languages: { [key: string]: string };
  area: number;
}

const FIELDS = 'name,flags,region,capital,population,currencies,languages,area';

@Injectable({ providedIn: 'root' })
export class CountryService {
  private http = inject(HttpClient);
  private base = 'https://restcountries.com/v3.1';

  getAllCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.base}/all?fields=${FIELDS}`);
  }

  getCountryByName(name: string): Observable<Country[]> {
    const encoded = encodeURIComponent(name);
    return this.http.get<Country[]>(
      `${this.base}/name/${encoded}?fullText=true&fields=${FIELDS}`
    );
  }
}
