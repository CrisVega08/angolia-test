import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { BASE_QUERIES } from '../constants/algolia'
@Injectable({
  providedIn: 'root'
})
export class AlgoliaService {

  subject = new BehaviorSubject(BASE_QUERIES);
  constructor() {}

  newSearch(config): void {
    this.subject.next(config);
  }
}
