import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-order-by-select',
  templateUrl: './order-by-select.component.html',
  styleUrls: ['./order-by-select.component.scss']
})
export class OrderBySelectComponent implements OnInit {
  @Input() options: [];
  @Output() changeQueryOrderBy = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  emitQuery({ target }): void {
    this.changeQueryOrderBy.emit(target.value);
  }
}
