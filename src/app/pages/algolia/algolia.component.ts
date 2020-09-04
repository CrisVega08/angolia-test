import { Component, OnInit } from '@angular/core';
import { HttpParams, HttpClient } from "@angular/common/http";
import { AlgoliaService } from '../../services/algolia.service';
import { BASE_QUERIES, ORDER_BY_OPTIONS } from '../../constants/algolia';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-algolia',
  templateUrl: './algolia.component.html',
  styleUrls: ['./algolia.component.scss']
})
export class AlgoliaComponent implements OnInit {
  get queries(): any[] {
    return this.algoliaService.getQueriesByFacets();
  }

  client;
  index;
  cars: [];
  suggestions: [];
  orderByIndecesOptions = ORDER_BY_OPTIONS;
  currentQuery = '';
  facets: [];
  baseQueries = BASE_QUERIES;
  facetsGetted = false;
  carsSubscription: Subscription;
  

  constructor(private algoliaService: AlgoliaService, private http: HttpClient) {}

  ngOnInit(): void {
    this.client = this.algoliaService.client;
    // One query for all facets and first page of card
    this.client.multipleQueries(BASE_QUERIES).then(({ results }) => {
      const [ cars, suggest ] = results;
      const { hits, facets } = cars;
      this.cars = hits;
      this.algoliaService.setSuggestions(suggest.hits);
      this.suggestions = suggest.hits;
      this.algoliaService.setFilters(facets);
      this.facetsGetted = true;
    });
    this.carsSubscription = this.algoliaService.cars.subscribe((cars: []) => {
      this.cars = cars;
    });
  }


  readonly getUrlWithQueryParams = (params: HttpParams, url: string) : string => {
    if (params) {
      const jsonParams = params.keys().reduce((json, param ) => ({ ...json, [param]: params.get(param) }), {});
      return url +=
        '?' +
        Object.entries(jsonParams)
          .map((keyValue) => keyValue.join('='))
          .join('&');
    }
    return url;
  }

  trackByCard(_, car: any): string {
    return car.objectID;
  }

  newQuery(query): void {
    this.algoliaService.setQuery(query);
  }

  removeQuery(index): void {
    this.algoliaService.removeQueryByIndex(index);
  }

  orderByChanged(indexName): void {
    this.algoliaService.setIndex(indexName);
  }
}
