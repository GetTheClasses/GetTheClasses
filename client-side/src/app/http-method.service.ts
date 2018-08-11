import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Criteria } from './models/criteria';

@Injectable({
  providedIn: 'root'
})
export class HttpMethodService {
  constructor(private http: HttpClient) { }

  response: any;

  criteria: Criteria;

  get(url: string): Observable<any> {
    console.log(1234);
    return this.http.get<any>(url);
  }

  post(url: string, data: any): Observable<any> {
    return this.http.post<any>(url, data);
  }
}
