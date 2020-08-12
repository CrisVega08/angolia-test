import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, debounceTime, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Input() suggestions: [];
  @Output() queryValueChanged = new EventEmitter();
  form: FormGroup;
  showResults = false;
  queryValue = '';
  subscription: Subscription;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      value: ['', Validators.required]
    });

    this.subscription = this.form.valueChanges.pipe(
      map(({ value }) => value),
      debounceTime(300),
    ).subscribe(value => {
      this.queryValue = value;
      this.queryValueChanged.emit(value);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    const value = this.form.value.value;
    if (value) {
      if (value !== this.queryValue) {
        this.queryValueChanged.emit(this.form.value.value);
      }
      this.form.patchValue({ value: null});
      this.showResults = false;
    }

  }

  setValue(newValue): void {
    this.form.patchValue({ value: newValue});
    this.showResults = false;
  }
}
