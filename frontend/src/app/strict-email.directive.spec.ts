import { Component } from '@angular/core';
import { StrictEmailDirective } from './strict-email.directive';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';


@Component({
  template: `
   <form>
      <input type="text" [formControl]="email" strictEmail />
    </form>
  `,
  standalone: false
})
class TestHostComponent {
  email = new FormControl('');
}

describe('StrictEmailDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [ReactiveFormsModule, FormsModule, StrictEmailDirective]
    });

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should validate correct email', () => {
    component.email.setValue('test@example.com');
    expect(component.email.valid).toBeTrue();
    expect(component.email.errors).toBeNull();
  });

  it('should invalidate incorrect email', () => {
    component.email.setValue('test.com');
    expect(component.email.valid).toBeFalse();
    expect(component.email.errors).toEqual({ strictEmail: true});
  });

  it('should invalidate email without domain suffic', () => {
    component.email.setValue('test@test');
    expect(component.email.valid).toBeFalse();
    expect(component.email.errors).toEqual({ strictEmail: true});
  });

  it('should invalidate empty email', () => {
    component.email.setValue('');
    expect(component.email.valid).toBeFalse();
    expect(component.email.errors).toEqual({ strictEmail: true});
  });

  it('should invalidate email with spaces', () => {
    component.email.setValue('test@ test.com');
    expect(component.email.valid).toBeFalse();
    expect(component.email.errors).toEqual({ strictEmail: true});
  });
});
