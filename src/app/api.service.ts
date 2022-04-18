import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private countriesUrl: string = environment.countries_api;
  private backendUrl = environment.api_back;

  constructor(private http: HttpClient) {

  }
  private getToken() {
    const headers: HttpHeaders = new HttpHeaders({
      "api-token": `${environment.countries_key}`,
      "user-email": "xel.salg@gmail.com"
    });
    return this.http.get(`${this.countriesUrl}/getaccesstoken`, { headers }).pipe(tap((res: any) => {
      if (res?.auth_token) localStorage.setItem('token', res?.auth_token)
    }));
  }

  getStates(name: string) {
    let headers: HttpHeaders = new HttpHeaders();
    const request = localStorage.getItem('token') ? of({}) : this.getToken();
    return request.pipe(concatMap(() => {
      const token = `Bearer ${localStorage.getItem('token')}`
      headers = new HttpHeaders({ Authorization: token });
      return this.http.get<any[]>(`${this.countriesUrl}/states/${name}`, { headers })
    }
    ))
  }

  getCities(name: string) {
    let headers: HttpHeaders = new HttpHeaders();
    const request = localStorage.getItem('token') ? of({}) : this.getToken();
    return request.pipe(concatMap(() => {
      const token = `Bearer ${localStorage.getItem('token')}`
      headers = new HttpHeaders({ Authorization: token });
      return this.http.get(`${this.countriesUrl}/cities/${name}`, { headers })
    }
    ))
  }

  getFakeCountries() {
    return of(['Peru', 'Brazil'])
  }

  getSalesRegion() {
    return of(['Costa', 'Sierra', 'Selva'])
  }

  calculatePrice(values: any) {
    let params: any = {
      'country': values.country,
      'priceBase': values.priceBase,
      'region': values.region,
      'stateOrigin': values.stateOrigin,
      'stateSale': values.stateSale
    };
    return this.http.get(`${this.backendUrl}/v1/price/`, { params });

  }
}