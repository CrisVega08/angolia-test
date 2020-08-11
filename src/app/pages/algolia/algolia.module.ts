import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlgoliaComponent } from './algolia.component';

import { CardCarModule } from '../../components/card-car/card-car.module'; 
import { SearchModule} from '../../components/search/search.module'
@NgModule({
  declarations: [AlgoliaComponent],
  imports: [
    CommonModule,
    CardCarModule,
    SearchModule
  ],
  exports: [AlgoliaComponent]
})
export class AlgoliaModule { }
