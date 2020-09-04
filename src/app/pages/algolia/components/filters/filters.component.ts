import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlgoliaService } from 'src/app/services/algolia.service';
import { Subscription } from 'rxjs';

import { Facets, Make } from '../../../../interfaces/Facets.interface';
@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {
  constructor(private algoliaService: AlgoliaService) {}
  data: Facets;
  subscription: Subscription;
  carMakesOptions: Make[];
  ngOnInit(): void {
    this.subscription = this.algoliaService.facets.subscribe((facets: Facets) => {
      this.data = facets;
      if (this.data.car_make) {
        this.addImagesUrl();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addImagesUrl(): void {
    this.carMakesOptions = Object.keys(this.data.car_make)
      .map((make) => ({make, url: this.getLogo(make), amount: this.data.car_make[make]}));
  }

  searchByFilter(filterName = '', value = ''): void{
    this.algoliaService.setCurrentCarModel([]);
    this.algoliaService.makeQueryCarMake({
      facets: ['*'],
      filters: `${filterName}:${value}`,
    });

  }

  searchByModel(model): void {
    // this.algoliaService.setCurrentCarModel([]);
    // this.algoliaService.newSearch([{
    //   indexName: this.algoliaService.getIndex(),
    //   query: model,
    // }]);
  }

  searchByFacet({property, value, make}): void {
    if (make) {
      this.algoliaService.removeMakeAndPushFacet(make, { property, value });
    } else {
      this.algoliaService.pushFacetQuery({ property, value });
    }
  }

  private getLogo(carMake, white = false): string {
    let path = 'https://images.kavak.services/assets/images/brands';
    const key = carMake
      .toLowerCase()
      .replace(' ', '')
      .replace('benz', '');
    if (white) {
      path = `${path}/white`;
    }
    return `${path}/${key}.svg`;
  }
}
