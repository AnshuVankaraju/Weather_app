import { Component, input } from '@angular/core';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { WeatherData, WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-weather-card',
  imports: [DecimalPipe, TitleCasePipe],
  templateUrl: './weather-card.component.html',
  styleUrl: './weather-card.component.scss'
})
export class WeatherCardComponent {
  weather = input.required<WeatherData>();

  constructor(public weatherService: WeatherService) {}

  getWindDirection(deg: number): string {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(deg / 45) % 8];
  }
}
