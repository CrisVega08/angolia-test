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
        this.facets = facets;
      });
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
    const [newQuery] = Object.assign(this.baseQueries, [{ indexName, query: this.currentQuery }]);
    console.log(newQuery);
    this.algoliaService.newSearch([newQuery]);
  }
}
