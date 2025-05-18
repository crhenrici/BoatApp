import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../auth.service';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['signup']);
    await TestBed.configureTestingModule({
      imports: [
        SignupComponent,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule 
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        provideRouter([]),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should signup and navigate on success', inject([Router], (router: Router) => {
    const navigateSpy = spyOn(router, 'navigate');
    authServiceSpy.signup.and.returnValue(of({id: 1, name: 'Test', email: 'test@test.ch'}));

    component.email = 'test@test.ch';
    component.name = 'Test';
    component.password = 'test';

    component.onRegister();

    expect(authServiceSpy.signup).toHaveBeenCalledWith('Test', 'test@test.ch', 'test');
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  }));

  it('should set signupError on failure', () => {
    authServiceSpy.signup.and.returnValue(throwError(() => 'User with email test@test.ch already exists'));

    component.email = 'test@test.ch';
    component.name = 'Test';
    component.password = 'test';

    component.onRegister();

    expect(component.signupError).toBe('User with email test@test.ch already exists');
  });

  it('should set signupError if any field is missing', () => {
    component.email = '';
    component.name = 'Test';
    component.password = 'test';
    
    component.onRegister();

    expect(component.signupError).toBe('Please fill in all fields.');
  });

  it('should disable button if form is invalid', () => {
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeTrue();
  });
});
