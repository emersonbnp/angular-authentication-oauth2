import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import {
    HttpHandler,
    HttpHeaderResponse,
    HttpInterceptor,
    HttpRequest,
    HttpSentEvent,
} from '@angular/common/http/public_api';
import { HttpProgressEvent, HttpResponse, HttpUserEvent } from '@angular/common/http/src/response';
import { Error } from 'tslint/lib/error';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import { AuthService } from './authetication-service';

@Injectable()
export class InterceptService implements HttpInterceptor {

    constructor (private authService: AuthService) {}

    /*  This method is responsible for intercepting every request to the resource server
    *   in order to add the access token to its header. Whenever a code 401 response is
    *   received, the method that carries out the token refreshing task is called.
    **/

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent |
    HttpHeaderResponse |
    HttpProgressEvent |
    HttpResponse<any> |
    HttpUserEvent<any>> {
        const token = this.authService.getAuthToken();
        if (token && token != null && token !== 'null' && token !== '') {
            return next.handle(this.addToken(req, this.authService.getAuthToken())).catch( error => {
                if (error instanceof HttpErrorResponse) {
                switch ((<HttpErrorResponse>error).status) {
                    case 400:
                        return this.handle400Error(error);
                    case 401:
                        return this.handle401Error(req, next);
                }
            }
            return Observable.throw(error);
            } );
        } else {
            return next.handle(req);
        }
    }

    /*  Method that adds the access token to the request header */

    addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
         let headers = new HttpHeaders();

        headers = headers.append('Authorization', 'Bearer ' + this.authService.getAuthToken());
        headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return req.clone({ setHeaders: { Authorization: 'Bearer ' + token }});
    }

    /* If invalid grant is returned, the token is probably invalid and should be renewed */

    private handle400Error(error: any): Observable<any> {
        if (error && error.error && error.error.error === 'invalid_grant') {
            this.clearTokens();
        }
        return Observable.throw(error);
    }

    /*  This method is called when the server returns error 401, which means that the token sent
    *   is not valid. In this case, if we have a refresh token in hand, we send it in order to
    *   get a new access token, add it to the header and send the request
    */

    private handle401Error(req: any, next: any): Observable<any> {
        if (this.authService.getRefreshToken() && this.authService.getRefreshToken() !== '') {
            this.authService.refreshToken('refresh_token', this.authService.getRefreshToken())
                    .subscribe(response => {
                this.authService.setAuthToken(response.access_token);
                return next.handle(this.addToken(req, this.authService.getAuthToken())).catch(error => {
                    this.clearTokens();
                });
            }, error => {
                this.clearTokens();
            });
            return null;
        } else {
            this.clearTokens();
        }
    }

    /*  Method responsible for cleaning both the access and the refresh tokens */

    private clearTokens () {
        this.authService.setAuthToken('');
        this.authService.setRefreshToken('');
    }

}
