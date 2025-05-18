import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TokenService } from './token.service';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenService: jasmine.SpyObj<TokenService>;

  const apiUrl = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    const tokenServiceSpy = jasmine.createSpyObj('TokenService', ['getToken', 'setToken', 'clearToken']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TokenService, useValue: tokenServiceSpy },
        AuthService,
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should login and set token', () => {
    const dummyResponse = { token: 'sometoken'};

    service.login('test@test.ch', 'test').subscribe();

    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@test.ch', password: 'test'});

    req.flush(dummyResponse);

    expect(tokenService.setToken).toHaveBeenCalledWith('sometoken');
    expect(service.loggedIn).toBeTrue();
  });

  it('should signup and return user', () => {
    const  dummyUser = { id: 1, name: 'Test', email: 'test@test.ch', password: 'test'};

    service.signup(dummyUser.name, dummyUser.email, dummyUser.password).subscribe(user => {
      expect(user).toEqual(dummyUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/signup`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Test', email: 'test@test.ch', password: 'test'});

    req.flush(dummyUser);
  });

  it('should return login state with isLoggedIn', () => {
    service.loggedIn = true;

    expect(service.isLoggedIn()).toBeTrue();

    service.loggedIn = false;

    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should handle 401 error', () => {
    service.login('test@test.ch', 'test').subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.message).toBe('Invalid credentials');
      }
    });
  
    const req = httpMock.expectOne(`${apiUrl}/login`);
    req.flush('Unauthorized', {status: 401, statusText: 'Unauthorized'});
  });

});
