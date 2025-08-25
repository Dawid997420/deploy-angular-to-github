import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { KeycloakService } from "./app/keycloak/keycloak.service";

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor{

constructor(public keycloakService: KeycloakService) {

}
    



intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string | undefined = this.keycloakService.keycloak?.token;
    if ( token ) {
        const authReq: HttpRequest<any> = req.clone( {
            headers: new HttpHeaders( {
                Authorization: `Bearer ${token}`
            })
        });
        return next.handle(authReq);
    }
    return next.handle(req)
}





}


