import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClickOutSideModule} from '../../directives/click-out-side/click-out-side.module';

import { SearchComponent } from './search.component';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClickOutSideModule
  ],
  exports: [SearchComponent]
})
export class SearchModule {}
