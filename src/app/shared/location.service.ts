import { Coordinates } from './location.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  center: Coordinates;

  constructor() { }
}
