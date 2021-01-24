import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  url:string = 'https://restcountries.eu';

  constructor(private http:HttpClient ) { }


  getAllCountries(){
    return this.http.get(`${this.url}/rest/v2/all`);
  }
}
