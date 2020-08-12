import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { BASE_QUERIES } from '../constants/algolia';
import { Facets } from '../interfaces/Facets.interface';
@Injectable({
  providedIn: 'root'
})
export class AlgoliaService {
  subject = new BehaviorSubject(BASE_QUERIES);
  facets = new BehaviorSubject({});
  private filters: Facets;
  private index = 'dev_Kavak';
  private suggestions: any[];
  private currentCarModel: [];
  constructor() {}

  newSearch(config): void {
    this.subject.next(config);
  }

  setFilters(data): void {
    this.filters = data;
    this.facets.next(data);
  }

  getFilters(): Facets {
    return this.filters;
  }

  setIndex(newIndex): void {
    this.index = newIndex;
  }

  getIndex(): string {
    return this.index;
  }

  setSuggestions(newSuggestions): void {
    this.suggestions = newSuggestions;
  }

  getSuggestions(): any[] {
    return this.suggestions;
  }

  setCurrentCarModel(carModels): void {
    this.currentCarModel = carModels;
  }

  getCurrentCarModel(): any[] {
    return this.currentCarModel;
  }
}
