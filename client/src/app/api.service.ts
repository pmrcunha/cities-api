import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly API_URL = 'http://localhost:8080'; // URL to the Express server

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = 'dGhlc2VjcmV0dG9rZW4='; // This is just a dummy token for demo purposes!
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  // Fetch cities by tag
  getCitiesByTag(tag: string, isActive: boolean): Observable<any> {
    return this.http.get<any>(
      `${this.API_URL}/cities-by-tag?tag=${tag}&isActive=${isActive}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Calculate distance between two cities
  getDistanceBetweenCities(
    fromCityId: string,
    toCityId: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.API_URL}/distance?from=${fromCityId}&to=${toCityId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Fetch cities within a specified distance of a given city
  getCitiesInArea(cityId: string, distance: number): Observable<any> {
    return this.http.get<any>(
      `${this.API_URL}/area?from=${cityId}&distance=${distance}`,
      { headers: this.getAuthHeaders() }
    );
  }

  pollCities(url: string): Observable<any> {
    return this.http.get<any>(url, {
      headers: this.getAuthHeaders(), // Assuming you have this method for adding Bearer token headers
    });
  }

  // Fetch all cities
  getAllCities(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/all-cities?limit=50`, {
      headers: this.getAuthHeaders(),
    });
  }
}
