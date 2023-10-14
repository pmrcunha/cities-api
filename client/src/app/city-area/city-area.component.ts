import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { switchMap, takeWhile, tap, mergeMap } from 'rxjs/operators';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-city-area',
  templateUrl: './city-area.component.html',
  styleUrls: ['./city-area.component.scss'],
})
export class CityAreaComponent {
  cityId: string = 'db52fa77-9a6f-45f0-add0-cbafd5eaf63a';
  distance: number = 0;
  citiesInArea: any[] = [];
  resultsUrl: string = '';
  citiesList: any[] = []; // New variable to hold all cities for dropdown

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    console.log('CityAreaComponent initialized.');

    this.apiService.getAllCities().subscribe((cities) => {
      console.log(cities);

      this.citiesList = cities;
    });
  }

  // Method to fetch the results URL
  fetchResultsUrl(): void {
    this.apiService.getCitiesInArea(this.cityId, this.distance).subscribe(
      (data) => {
        this.resultsUrl = data.results; // Store the results URL
        this.pollResults(); // Start polling once we have the URL
      },
      (error) => console.error('Error getting polling URL:', error)
    );
  }

  // Method to poll the results URL
  pollResults(): void {
    const MAX_POLLING_COUNT = 5; // Maximum times to poll
    let pollingCount = 0;

    if (!this.resultsUrl) {
      console.error('No results URL provided.');
      return;
    }

    interval(2000)
      .pipe(
        switchMap(() => this.apiService.pollCities(this.resultsUrl)),
        takeWhile(() => pollingCount < MAX_POLLING_COUNT)
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          if (response) {
            this.citiesInArea = response.cities;
            pollingCount = MAX_POLLING_COUNT; // Stop polling if we get data
          } else {
            pollingCount++;
          }
        },
        error: (error) => console.error('Error polling cities:', error),
      });
  }
}
