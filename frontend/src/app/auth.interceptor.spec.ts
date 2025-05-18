import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthInterceptor } from './auth.interceptor';
import { TokenService } from './token.service';

class MockTokenService {
  getToken(): string | null {
    return "mock-jwt-token";
  }
}

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let tokenService: MockTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: TokenService, useClass: MockTokenService },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService) as unknown as MockTokenService;
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should add Authorization header if token exists', () => {
    http.get('/home').subscribe();

    const req = httpMock.expectOne('/home');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-jwt-token');
    req.flush({});
  });

  it('should not add Authorization header if no token', () => {
    spyOn(tokenService, 'getToken').and.returnValue(null);

    http.get('/home').subscribe();

    const req = httpMock.expectOne('/home');
    expect(req.request.headers.has('Authorization')).toBeFalse();

    req.flush({});
  });

});
