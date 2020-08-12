import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from './filters.component';
import { MakeFilterComponent } from '../make-filter/make-filter.component';

@NgModule({
  declarations: [FiltersComponent, MakeFilterComponent],
  imports: [CommonModule],
  exports: [FiltersComponent]
})
export class FiltersModule {}
