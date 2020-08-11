import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, debounceTime, filter } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Input() suggest: [];
  @Output() queryValueChanged = new EventEmitter();
  form: FormGroup;
  showResults = false;
  queryValue = '';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      value: ['', Validators.required]
    });

    this.form.valueChanges.pipe(
      map(({ value }) => value),
      debounceTime(300),
      filter((x) => x.length > 2),
    ).subscribe(value => {
      this.queryValue = value;
      this.queryValueChanged.emit(value)
    });
  }

  // tslint:disable-next-line: typedef
  onSubmit() {
    const value = this.form.value.value;
    if (value !== this.queryValue) {
      this.queryValueChanged.emit(this.form.value.value)
    }
    this.form.patchValue({ value: null});
    this.showResults = false;
  }
}
