import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { queries } from '../constants/algolia'
@Injectable({
  providedIn: 'root'
})
export class AlgoliaService {

  subject = new BehaviorSubject(queries);
  constructor() {}

  newSearch(config) {
    this.subject.next(config);
  }
}
