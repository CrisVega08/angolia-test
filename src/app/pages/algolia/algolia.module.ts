import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import { AlgoliaComponent } from './algolia.component';

import { CardCarModule } from '../../components/card-car/card-car.module';
import { SearchModule} from '../../components/search/search.module';
import { OrderBySelectModule } from '../../components/order-by-select/order-by-select.module';
import { FiltersModule } from './components/filters/filters.module';

@NgModule({
  declarations: [AlgoliaComponent],
  imports: [
    CommonModule,
    CardCarModule,
    SearchModule,
    OrderBySelectModule,
    FiltersModule,
    HttpClientModule
  ],
  exports: [AlgoliaComponent]
})
export class AlgoliaModule { }
