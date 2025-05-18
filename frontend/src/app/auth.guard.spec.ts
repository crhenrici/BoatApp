import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';


class MockAuthService {
  isLoggedIn = jasmine.createSpy().and.returnValue(false);
}

class MockRouter {
  navigate = jasmine.createSpy().and.returnValue(Promise.resolve(true));
}

describe('authGuard', () => {
  let authService: MockAuthService;
  let router: MockRouter;

  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter }
      ]
    });

    authService = TestBed.inject(AuthService) as unknown as MockAuthService
    router = TestBed.inject(Router) as unknown as MockRouter
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow access when logged in', () => {
    authService.isLoggedIn.and.returnValue(true);

    const result = executeGuard({} as any, {} as any);

    expect(result).toBeTrue();
  }); 

  it('should redirect to login when not logged in', async () => {
    authService.isLoggedIn.and.returnValue(false);

    const result = await executeGuard({} as any, {} as any);

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
