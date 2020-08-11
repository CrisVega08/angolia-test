import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-card-car',
  templateUrl: './card-car.component.html',
  styleUrls: ['./card-car.component.scss']
})
export class CardCarComponent implements OnInit {
  @Input() carInfo;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
  }

  lazyLoad() {
    if (isPlatformBrowser(this.platformId)) {
      requestAnimationFrame(() => true);
    }
  }
}
