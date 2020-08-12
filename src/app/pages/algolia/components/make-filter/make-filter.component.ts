import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-make-filter',
  templateUrl: './make-filter.component.html',
  styleUrls: ['./make-filter.component.scss']
})
export class MakeFilterComponent implements OnInit {
  @Input() makes: [];
  @Output() makeSelected = new EventEmitter();
  full = false;

  constructor() {}

  ngOnInit(): void {
    console.log(this.makes, 'makes');
  }

  selectedMake(make): void {
    this.makeSelected.emit(make);
  }
}
