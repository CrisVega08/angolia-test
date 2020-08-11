import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardCarComponent } from './card-car.component';
@NgModule({
  declarations: [CardCarComponent],
  imports: [
    CommonModule
  ],
  exports: [CardCarComponent]
})
export class CardCarModule {}
