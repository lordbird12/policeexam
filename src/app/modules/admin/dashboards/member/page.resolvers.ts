import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PageService } from 'app/modules/admin/dashboards/member/page.service';

@Injectable({
    providedIn: 'root'
})
export class PageResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _Service: PageService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._Service.getData();
    }
}
