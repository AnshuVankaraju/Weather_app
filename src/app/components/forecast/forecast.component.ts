import { Component, input, computed } from '@angular/core';
import { DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { WeatherService } from '../../services/weather.service';

// Local interface — kept here as this component is standalone/legacy
interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: { temp: number; temp_min: number; temp_max: number; humidity: number };
  weather: { id: number; main: string; description: string; icon: string }[];
  wind: { speed: number };
}

export interface ForecastData {
  list: ForecastItem[];
  city: { name: string; country: string };
}

interface DailyForecast {
  date: Date;
  minTemp: number;
  maxTemp: number;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-forecast',
  imports: [DatePipe, DecimalPipe, TitleCasePipe],
  templateUrl: './forecast.component.html',
  styleUrl: './forecast.component.scss'
})
export class ForecastComponent {
  forecastData = input.required<ForecastData>();

  constructor(public weatherService: WeatherService) {}

  dailyForecasts = computed<DailyForecast[]>(() => {
    const data = this.forecastData();
    const grouped: { [key: string]: ForecastItem[] } = {};

    data.list.forEach((item: ForecastItem) => {
      const date = item.dt_txt.split(' ')[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });

    return Object.entries(grouped)
      .slice(1, 6)
      .map(([dateStr, items]) => ({
        date: new Date(dateStr + 'T12:00:00'),
        minTemp: Math.min(...items.map((i: ForecastItem) => i.main.temp_min)),
        maxTemp: Math.max(...items.map((i: ForecastItem) => i.main.temp_max)),
        icon: items[Math.floor(items.length / 2)].weather[0].icon,
        description: items[Math.floor(items.length / 2)].weather[0].description
      }));
  });
}
