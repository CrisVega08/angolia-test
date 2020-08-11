import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClickOutsideDirective} from './click-out-side.directive';

@NgModule({
  declarations: [ClickOutsideDirective],
  imports: [CommonModule],
  exports: [ClickOutsideDirective]
})
export class ClickOutSideModule { }
