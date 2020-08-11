import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderBySelectComponent } from './order-by-select.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [OrderBySelectComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [OrderBySelectComponent]
})
export class OrderBySelectModule {}
