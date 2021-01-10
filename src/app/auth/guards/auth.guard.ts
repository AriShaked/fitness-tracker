import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot , Router, Route, CanLoad } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import * as fromRoot from '../../app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate , CanLoad {

constructor(private store: Store<fromRoot.State>) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      return this.store.select(fromRoot.getIsAuth).pipe(take(1));


    // if (this.authService.isAuth()) {
    //   return true;
    // } else {
    //   this.router.navigate(['/login']);
    // }
  }

  canLoad(route: Route) {

    return this.store.select(fromRoot.getIsAuth).pipe(take(1));

    // if (this.authService.isAuth()) {
    //   return true;
    // } else {
    //   this.router.navigate(['/login']);
    // }
  }



}
