import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlgoliaService } from 'src/app/services/algolia.service';

@Component({
  selector: 'app-make-filter',
  templateUrl: './make-filter.component.html',
  styleUrls: ['./make-filter.component.scss']
})
export class MakeFilterComponent implements OnInit {
  get carModels(): any[] {
    return this.algoliaService.getCurrentCarModel();
  }
  @Input() makes: [];
  @Output() makeSelected = new EventEmitter();
  @Output() modelSelected = new EventEmitter();
  @Output() facetSelected = new EventEmitter();
  full = false;
  currentMake: string;

  constructor(private algoliaService: AlgoliaService) {}

  ngOnInit(): void {}

  selectedMake(make): void {
    this.currentMake = make;
    this.makeSelected.emit(make);
  }

  selectedModel(model): void {
    this.modelSelected.emit(model.replace(/\s/g, ''));
  }

  selectedFacet(property, value, make = ''): void {
    this.facetSelected.emit({ property, value, make });
  }
}
