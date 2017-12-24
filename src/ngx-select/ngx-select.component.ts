import { Component, DoCheck, forwardRef, Input, IterableDiffer, IterableDiffers, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgSelectOption, Validator } from '@angular/forms';
import { KeyboardEvent } from 'ngx-bootstrap/utils/facade/browser';
import { NgxSelectOptGroup, NgxSelectOption } from './ngx-select.classes';

@Component({
  selector: 'ngx-select',
  templateUrl: './ngx-select.component.html',
  styleUrls: ['./ngx-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NgxSelectComponent),
      multi: true
    }
  ]
})
export class NgxSelectComponent implements OnInit, ControlValueAccessor, Validator, DoCheck {
  @Input() public items: any[];
  @Input() public valueField: string = 'id';
  @Input() public textField: string = 'text';
  @Input() public labelField: string = 'label';
  @Input() public optionsField: string = 'options';
  @Input() public multiple: boolean = false;
  @Input() public allowClear: boolean = false;
  @Input() public placeholder: string = '';
  @Input() public noAutoComplete: boolean = false;
  @Input() public disabled: boolean = false;
  @Input() public active: any | any[];


  protected optionsOpened: boolean = false;

  protected options: Array<NgxSelectOptGroup | NgxSelectOption> = [];
  private itemsDiffer: IterableDiffer<any>;

  constructor(iterableDiffers: IterableDiffers) {
    this.itemsDiffer = iterableDiffers.find([]).create<any>(null);
  }

  ngOnInit() {
  }

  ngDoCheck(): void {
    if (this.itemsDiffer.diff(this.items)) {
      this.options = this.buildOptions(this.items);
    }
  }

  protected mainClickedOutside(): void {
    this.optionsOpened = false;
  }

  protected mainKeyUp(event: KeyboardEvent): void {
  }

  protected focusToInput(): void {
  }

  protected matchClick(e: any): void {
    this.optionsOpened = true;
  }

  protected isActiveOption(option: NgxSelectOption): boolean {
    return false;
  }

  protected activateOption(option: NgxSelectOption): void {
  }

  protected selectOption(option: NgxSelectOption, $event: Event): void {
  }

  private buildOptions(data: any[]): Array<NgxSelectOption | NgxSelectOptGroup> {
    const result: Array<NgxSelectOption | NgxSelectOptGroup> = [];
    let option: NgxSelectOption;

    [].concat(data).forEach((item: any) => {
      const isOptGroup = typeof item === 'object' && item !== null &&
        item.hasOwnProperty(this.labelField) && item.hasOwnProperty(this.optionsField) &&
        Array.isArray(item[this.optionsField]);
      if (isOptGroup) {
        const optGroup = new NgxSelectOptGroup(item[this.labelField]);
        item[this.optionsField].forEach(subOption => {
          if (option = this.buildOption(subOption, optGroup)) {
            optGroup.options.push(option);
          }
        });
        result.push(optGroup);
      } else if (option = this.buildOption(item, null)) {
        result.push(option);
      }
    });

    return result;
  }

  private buildOption(data: any, parent: NgxSelectOptGroup): NgxSelectOption {
    let value, text;
    if (typeof data === 'string' || typeof data === 'number') {
      value = text = data;
    } else if (typeof data === 'object' && data !== null &&
      (data.hasOwnProperty(this.valueField) || data.hasOwnProperty(this.textField))) {
      value = data.hasOwnProperty(this.valueField) ? data[this.valueField] : data[this.textField];
      text = data.hasOwnProperty(this.textField) ? data[this.textField] : data[this.valueField];
    } else {
      return null;
    }
    return new NgxSelectOption(value, text, parent);
  }

  //////////// interface Validator ////////////
  validate(c: AbstractControl): { [key: string]: any; } {
    return null;
  }

  //////////// interface ControlValueAccessor ////////////
  public propagateChange = (_: any) => _;

  public onTouchedCallback: () => void = () => null;

  writeValue(obj: any): void {
  }

  public registerOnChange(fn: (_: any) => {}): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(fn: () => {}): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }
}