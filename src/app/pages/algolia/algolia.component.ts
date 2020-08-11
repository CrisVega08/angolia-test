import { Component, OnInit } from '@angular/core';
import algoliasearch from 'algoliasearch';
import { AlgoliaService } from '../../services/algolia.service';
import { queries } from '../../constants/algolia'
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
  suggest: [];
  constructor(private algoliaService: AlgoliaService) {}

  ngOnInit() {
    this.client = algoliasearch(this.algolia.app_id, this.algolia.api_key);
    this.index = this.client.initIndex(this.algolia.index);
    this.algoliaService.subject.subscribe(queries => {
      this.client.multipleQueries(queries).then(({ results }) => {
        const [ cars, suggest ] = results;
        const { hits, facets } = cars;
        this.suggest = suggest.hits;
        this.cars = hits;
        // filterService.createFilter(facets);
      });
    })
  }

  trackByCard(_, car: any): string {
    return car.objectID;
  }

  newQuery(query) {
    const base = Object.assign([], queries)
    base.forEach(config => config.query = query)
    this.algoliaService.newSearch(base)
  }
}
