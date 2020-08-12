import { Component, OnInit } from '@angular/core';
import algoliasearch from 'algoliasearch';
import { AlgoliaService } from '../../services/algolia.service';
import { BASE_QUERIES, ORDER_BY_OPTIONS } from '../../constants/algolia';
@Component({
  selector: 'app-algolia',
  templateUrl: './algolia.component.html',
  styleUrls: ['./algolia.component.scss']
})
export class AlgoliaComponent implements OnInit {
  client;
  index;
  algolia = {
    app_id: 'testingRBJ6QNRFVQ',
    api_key: 'b5bcce39b3db484e85bbc6eaad3f9654',
    index: 'dev_Kavak',
    querySuggestions: 'dev_qs',
  };
  cars: [];
  suggestions: [];
  orderByIndecesOptions = ORDER_BY_OPTIONS;
  currentQuery = '';
  facets: [];
  baseQueries = BASE_QUERIES;
  facetsGetted = false;

  constructor(private algoliaService: AlgoliaService) {}

  ngOnInit(): void {
    this.client = algoliasearch(this.algolia.app_id, this.algolia.api_key);
    this.index = this.client.initIndex(this.algolia.index);
    this.algoliaService.subject.subscribe(newQueries => {
      this.client.multipleQueries(newQueries).then(({ results }) => {
        const [ cars, suggest ] = results;
        const { hits, facets } = cars;
        if (suggest) {
          this.suggestions = suggest.hits;
        }
        this.cars = hits;
        if (!this.facetsGetted) {
          this.algoliaService.setSuggestions(suggest.hits);
          this.algoliaService.setFilters(facets);
          this.facetsGetted = true;
        } else if (facets && facets.car_model) {
          const carModelByFacet = Object.keys(facets.car_model).map((model) => ({ model, quantity: facets.car_model[model] }))
          this.algoliaService.setCurrentCarModel(carModelByFacet);
        }
        this.facets = facets;
        this.testFacets();
      });
    });
  }

  testFacets(): void { // obtengo todos los car_models
    this.index.searchForFacetValues('car_model', '', {

    }).then(({ facetHits }) => {
      console.log(facetHits);
    });
  }

  testFacets2(): void {
    this.index.search('', {
      tagFilters: [
        [
          'onix',
          'Mazda 2'
        ]
      ]
    }).then(({ hits }) => {
      console.log(hits);
    });
  }

  trackByCard(_, car: any): string {
    return car.objectID;
  }

  newQuery(query): void {
    this.currentQuery = query;
    const base = Object.assign([], this.baseQueries);
    base.forEach(config => config.query = query);
    this.algoliaService.newSearch(base);
  }

  orderByChanged(indexName): void {
    this.client.initIndex(indexName);
    this.algoliaService.setIndex(indexName)
    const [newQuery] = Object.assign(this.baseQueries, [{ indexName, query: this.currentQuery }]);
    this.algoliaService.newSearch([newQuery]);
  }
}
