import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TokenService } from "./token.service";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const jwt = this.tokenService.getToken();
      if (jwt) {
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${jwt}`
          }
        });
        return next.handle(cloned);
      }
      return next.handle(req);
  }
}