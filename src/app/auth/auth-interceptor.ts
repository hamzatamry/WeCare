import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }
    
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (req.url.includes("https://maps.googleapis.com/maps/api/")) {
            return next.handle(req);
        }
        const accessToken = this.authService.token;
        const authRequest = req.clone({
            headers: req.headers.set("Authorization", "Bearer " + accessToken)
        });
        return next.handle(authRequest);
    }
}