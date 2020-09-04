import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import algoliasearch from 'algoliasearch';

import { BASE_QUERIES } from '../constants/algolia';
import { Facets } from '../interfaces/Facets.interface';
@Injectable({
  providedIn: 'root'
})
export class AlgoliaService {
  carModels = new BehaviorSubject([]);
  facets = new Subject();
  cars = new Subject();

  index;
  client;
  query = '';

  private queriesByFacet = [];
  private filters: Facets;
  private indexName = 'dev_Kavak';
  private suggestions: any[];
  private currentCarModel: [];

  private algoliaConfig = {
    app_id: 'testingRBJ6QNRFVQ',
    api_key: 'b5bcce39b3db484e85bbc6eaad3f9654',
    index: this.indexName,
    querySuggestions: 'dev_qs',
  };

  constructor() {
    this.client = algoliasearch(this.algoliaConfig.app_id, this.algoliaConfig.api_key);
    this.index = this.client.initIndex(this.algoliaConfig.index);
  }

  setFilters(data): void {
    this.filters = data;
    this.facets.next(data);
  }

  getFilters(): Facets {
    return this.filters;
  }

  setIndex(newIndex): void {
    this.index = this.client.initIndex(newIndex);
    this.indexName = newIndex;
    this.makeQueryRequest();
  }

  getIndex(): string {
    return this.indexName;
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

  setQuery(query): void {
    this.query = query;
    this.makeQueryRequest(query);
  }

  removeQueryByIndex(index): void {
    if (this.queriesByFacet[index].property === 'query') {
      this.query = '';
    }
    this.queriesByFacet.splice(index, 1);
    this.updateFacetQuery();
  }

  getQueriesByFacets(): string[] {
    const array = this.queriesByFacet.map(facet => facet.value);
    return this.query ? [this.query, ...array] : [...array];
  }

  makeQueryRequest(query = '', params = {}): void {
    this.index.search(query, params).then(({ hits }) => {
      this.cars.next( hits );
    });
  }

  makeQueryCarMake(params): void {
    this.index.search('', params).then(({ facets }) => {
      const carModelByFacet = Object.keys(facets.car_model).map((model) => ({ model, quantity: facets.car_model[model] }))
      this.setCurrentCarModel(carModelByFacet);
    });
  }

  pushFacetQuery(facetOption): void {
    const { property, value } = facetOption;

    const existFacet = this.queriesByFacet.findIndex(facet => facet.property === property && facet.value === value);
    if (existFacet === -1 ) {
      const indexesToRemove = [];
      if (property === 'car_make') {
        this.queriesByFacet.forEach((facet, index) => {
          if (facet.property === 'car_model' && facet.make === value) {
            indexesToRemove.push(index);
          }
        });
  
        if (indexesToRemove.length) {
          indexesToRemove.reverse().forEach(index => this.queriesByFacet.splice(index, 1));
        }
      }
      this.queriesByFacet.push(facetOption);
      this.updateFacetQuery();
    }
  }

  updateFacetQuery(): void {
    const options = this.queriesByFacet.map(facet => `${facet.property}:${facet.value}`);
    this.makeQueryRequest(this.query, {facetFilters: [options]});
  }

  removeMakeAndPushFacet(make, facetOption): void {
    const makeIndex = this.queriesByFacet.findIndex(value => value.property === 'car_make' && value.value === make);
    if (makeIndex > -1) {
      this.queriesByFacet.splice(makeIndex, 1);
    }
    this.pushFacetQuery({...facetOption, make });
    // this.queriesByFacet.push({ property: 'query', value: query });
  }

  facetFilterRequest(): void {
    // this.index = this.algoliaService.index;
    this.index.search('', {
      facetFilters: [['car_make:chevrolet', 'car_make:mazda']]
    }).then(response => console.log(response));
  }
 }
