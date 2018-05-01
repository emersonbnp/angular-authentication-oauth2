import { passBoolean } from 'protractor/built/util';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

    constructor (private httpClient: HttpClient) { }

    /*  Tokens access methods begin */

    public getAuthToken () {
        return localStorage.getItem('auth_token');
    }

    public setAuthToken(token: string) {
        localStorage.setItem('auth_token', token);
    }

    public getRefreshToken () {
        return localStorage.getItem('refresh_token');
    }

    /*  Tokens access methods end */

    public setRefreshToken(token: string) {
        localStorage.setItem('refresh_token', token);
    }

    /*  Method responsible for the initial authentication of the user with the server. When
    *   the user attempts to log in, a request with basic authenticaiton with the client name
    *   and client password, the user identifier and their password is sent in order to get
    *   the access and the refresh token.
    */

    public authenticate(grantType: string, email: string, password: string): Observable<any> {
        let headers = new HttpHeaders();

        headers = headers.append('Authorization', 'Basic ' + btoa(environment.client + ':'
                + environment.password));
        headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this.httpClient.post(environment.apiUrl + '/oauth/token?grant_type=' +
            grantType + '&username=' + email + '&password=' + password, '{}', { headers: headers}
        );
    }

    /*  Method responsible for using the refresh token to obtain a new access token. */

    public refreshToken(grantType: string, refreshToken: string): Observable<any> {
        let headers = new HttpHeaders();

        headers = headers.append('Authorization', 'Basic ' + btoa(environment.client + ':'
                + environment.password));
        headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this.httpClient.post(environment.apiUrl + '/oauth/token?grant_type=' +
            grantType + '&refresh_token=' + refreshToken, '{}', { headers: headers}
        );
    }
}
