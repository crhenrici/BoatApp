import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { provideRouter, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
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

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login and navigate on success', inject([Router], (router: Router) => {
    const navigateSpy = spyOn(router, 'navigate');
    authServiceSpy.login.and.returnValue(of({ token: 'sometoken'}));

    component.email = 'test@test.com';
    component.password = 'test';
    fixture.detectChanges();

    component.onLogin();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@test.com', 'test');
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  }));

  it('should set loginError on failed login', () => {
    authServiceSpy.login.and.returnValue(throwError(() => 'Invalid login'));
    component.email = 'some@email.com';
    component.password = 'test';

    component.onLogin();

    expect(component.loginError).toBe('Invalid login');
  });
});
