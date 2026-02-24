import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarruselItem } from '../interfaces/interfazCarrusel';
import { environment } from '../../environments/environment';




@Injectable({providedIn: 'root',})

export class CarruselService {
  private baseUrl =  `${environment.apiBaseUrl}/carrusel`;

  constructor(private http: HttpClient) {}

  getCarrusel(): Observable<CarruselItem[]> {
    return this.http.get<CarruselItem[]>(this.baseUrl);
  }
}
