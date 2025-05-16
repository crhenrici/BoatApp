import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[strictEmail]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: StrictEmailDirective,
    multi: true
  }]
})
export class StrictEmailDirective implements Validator{

  constructor() { }
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(value) ? null : { strictEmail: true }
  }
}
