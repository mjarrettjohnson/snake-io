import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const COLOR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ColorPickerComponent),
  multi: true
};

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
  providers: [COLOR_VALUE_ACCESSOR]
})
export class ColorPickerComponent implements OnInit, ControlValueAccessor {

  color: string;

  constructor() { }

  onChange: (_: any) => void;

  onTouched: (_: any) => void;

  ngOnInit() {
  }

  handleChange(color: string) {
    this.onChange(color);
  }

  registerOnChange(fn: (_: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: any) => void) {
    this.onTouched = fn;
  }

  writeValue(value: any) {
    this.color = value;
  }
}
